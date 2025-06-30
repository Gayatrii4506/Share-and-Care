import { useState, useEffect, useRef, useCallback } from 'react';
import { ElevenLabsClient } from 'elevenlabs';
import toast from 'react-hot-toast';

interface VoiceAssistantConfig {
  apiKey: string;
  voiceId?: string;
  onCommand?: (command: string, confidence: number) => void;
  onError?: (error: string) => void;
}

interface VoiceCommand {
  pattern: RegExp;
  action: string;
  description: string;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useVoiceAssistant = (config: VoiceAssistantConfig) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const elevenLabsRef = useRef<ElevenLabsClient | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Voice commands patterns
  const commands: VoiceCommand[] = [
    { pattern: /show\s+(my\s+)?donations?/i, action: 'SHOW_DONATIONS', description: 'Show my donations' },
    { pattern: /mark\s+.+\s+as\s+delivered/i, action: 'MARK_DELIVERED', description: 'Mark donation as delivered' },
    { pattern: /mark\s+.+\s+as\s+verified/i, action: 'MARK_VERIFIED', description: 'Mark donation as verified' },
    { pattern: /mark\s+.+\s+as\s+picked/i, action: 'MARK_PICKED', description: 'Mark donation as picked' },
    { pattern: /log\s+(me\s+)?out/i, action: 'LOGOUT', description: 'Log me out' },
    { pattern: /sign\s+out/i, action: 'LOGOUT', description: 'Sign out' },
    { pattern: /go\s+to\s+dashboard/i, action: 'GO_DASHBOARD', description: 'Go to dashboard' },
    { pattern: /go\s+to\s+donate/i, action: 'GO_DONATE', description: 'Go to donate page' },
    { pattern: /help/i, action: 'HELP', description: 'Show available commands' },
    { pattern: /stop\s+listening/i, action: 'STOP_LISTENING', description: 'Stop voice assistant' },
    { pattern: /start\s+listening/i, action: 'START_LISTENING', description: 'Start voice assistant' },
  ];

  useEffect(() => {
    const initializeVoiceServices = async () => {
      try {
        if (config.apiKey && config.apiKey.trim() !== '') {
          console.log('Initializing ElevenLabs with API key...');
          elevenLabsRef.current = new ElevenLabsClient({
            apiKey: config.apiKey,
          });
          try {
            await elevenLabsRef.current.voices.getAll();
            console.log('ElevenLabs initialized successfully');
            setIsInitialized(true);
            toast.success('ElevenLabs voice assistant ready!');
            return;
          } catch (error) {
            console.warn('ElevenLabs API test failed:', error);
            elevenLabsRef.current = null;
          }
        }
        if ('speechSynthesis' in window) {
          synthRef.current = window.speechSynthesis;
          setIsInitialized(true);
          console.log('Voice assistant initialized with browser TTS (fallback)');
          toast.success('Voice assistant ready (browser mode)');
        } else {
          console.warn('No TTS available');
          config.onError?.('Text-to-speech not supported in this browser');
        }
      } catch (error) {
        console.error('Voice service initialization failed:', error);
        config.onError?.('Failed to initialize voice services');
      }
    };
    initializeVoiceServices();
  }, [config.apiKey]);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      toast.success('Microphone access granted');
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      toast.error('Microphone access required for voice commands');
      config.onError?.('Microphone access denied');
      return false;
    }
  }, [config.onError]);

  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        if (recognitionRef.current) {
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          recognitionRef.current.maxAlternatives = 1;
          recognitionRef.current.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
          };
          recognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
          };
          recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              }
            }
            if (finalTranscript) {
              console.log('Voice input received:', finalTranscript);
              setTranscript(finalTranscript);
              processCommand(finalTranscript, event.results[event.results.length - 1][0].confidence || 0.8);
            }
          };
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
              toast.error('Microphone access denied. Please allow microphone access and try again.');
              setHasPermission(false);
            } else if (event.error === 'no-speech') {
              toast.info('No speech detected. Try speaking again.');
            } else {
              config.onError?.(event.error);
            }
            setIsListening(false);
          };
          console.log('Speech recognition initialized');
        }
      } else {
        console.warn('Speech recognition not supported in this browser');
        config.onError?.('Speech recognition not supported in this browser');
      }
    };
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [config.onError]);

  const processCommand = useCallback((transcript: string, confidence: number) => {
    console.log('Processing command:', transcript, 'Confidence:', confidence);
    const command = commands.find(cmd => cmd.pattern.test(transcript));
    if (command && confidence > 0.5) {
      console.log('Command matched:', command.action);
      config.onCommand?.(command.action, confidence);
      switch (command.action) {
        case 'SHOW_DONATIONS':
          speak('Showing your donations now.');
          break;
        case 'MARK_DELIVERED':
          speak('Marking donation as delivered.');
          break;
        case 'MARK_VERIFIED':
          speak('Marking donation as verified.');
          break;
        case 'MARK_PICKED':
          speak('Marking donation as picked up.');
          break;
        case 'LOGOUT':
          speak('Logging you out now.');
          break;
        case 'GO_DASHBOARD':
          speak('Navigating to dashboard.');
          break;
        case 'GO_DONATE':
          speak('Navigating to donation page.');
          break;
        case 'HELP':
          speak('Here are the available commands: Show my donations, Mark donation as delivered, Log me out, Go to dashboard, Go to donate, and Help.');
          break;
        case 'STOP_LISTENING':
          speak('Voice assistant stopped.');
          setTimeout(() => stopListening(), 1000);
          break;
        default:
          speak('Command recognized.');
      }
    } else {
      console.log('Command not recognized or low confidence');
      speak("I didn't quite catch that. Please try again or say 'help' for available commands.");
    }
  }, [config.onCommand]);

  const speak = useCallback(async (text: string) => {
    console.log('Speaking:', text);
    try {
      setIsSpeaking(true);
      if (elevenLabsRef.current && config.voiceId) {
        console.log('Using ElevenLabs TTS');
        try {
          const audioStream = await elevenLabsRef.current.textToSpeech.convert({
            voice_id: config.voiceId,
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true
            }
          });
          const chunks: Uint8Array[] = [];
          const reader = audioStream.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
          const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
          }
          audioRef.current = new Audio(audioUrl);
          audioRef.current.onended = () => {
            console.log('ElevenLabs speech ended');
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
          audioRef.current.onerror = (error) => {
            console.error('Audio playback error:', error);
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
          await audioRef.current.play();
          return;
        } catch (elevenLabsError) {
          console.warn('ElevenLabs TTS failed, falling back to browser TTS:', elevenLabsError);
        }
      }
      if (synthRef.current) {
        console.log('Using browser TTS (fallback)');
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.onend = () => {
          console.log('Browser speech ended');
          setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
        };
        synthRef.current.speak(utterance);
      } else {
        console.warn('No TTS available');
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      config.onError?.('Failed to generate speech');
    }
  }, [config.voiceId, config.onError]);

  const startListening = useCallback(async () => {
    console.log('Attempting to start listening...');
    if (!hasPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        toast.success('Voice assistant activated - speak now!');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        config.onError?.('Failed to start voice recognition');
      }
    }
  }, [isListening, hasPermission, requestMicrophonePermission, config.onError]);

  const stopListening = useCallback(() => {
    console.log('Stopping listening...');
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      toast.success('Voice assistant deactivated');
    }
  }, [isListening]);

  const welcomeUser = useCallback((userName: string, role: string) => {
    const roleMessages = {
      donor: `Welcome back, ${userName}! Ready to make a difference with your donations today?`,
      volunteer: `Hello ${userName}! Thank you for volunteering. Let's help deliver some donations to those in need.`,
      admin: `Welcome ${userName}! Your admin dashboard is ready. You can manage donations and oversee operations.`,
    };
    const message = roleMessages[role.toLowerCase() as keyof typeof roleMessages] || 
                   `Welcome back, ${userName}! How can I assist you today?`;
    setTimeout(() => {
      speak(message);
    }, 500);
  }, [speak]);

  return {
    isListening,
    isSpeaking,
    isInitialized,
    hasPermission,
    transcript,
    startListening,
    stopListening,
    speak,
    welcomeUser,
    commands: commands.map(cmd => cmd.description),
  };
}; 