import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  createProfile: (fullName: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with enhanced error handling
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Handle refresh token errors gracefully
        if (error && error.message.includes('refresh_token_not_found')) {
          console.info('Refresh token not found, clearing session');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        if (error) {
          console.warn('Auth initialization error:', error.message);
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.id || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only fetch profile if session and user exist
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        }
      } catch (error: any) {
        console.warn('Auth initialization failed:', error.message);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with enhanced error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id || 'No user');
        
        try {
          // Handle specific auth events
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setSession(session);
            setUser(session?.user ?? null);
            
            // Only fetch profile if session and user exist
            if (session?.user?.id) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
            }
            setLoading(false);
          } else {
            // Handle other events (USER_UPDATED, etc.)
            setSession(session);
            setUser(session?.user ?? null);
            
            // Only fetch profile if session and user exist
            if (session?.user?.id) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
            }
            setLoading(false);
          }
        } catch (error: any) {
          console.warn('Auth state change error:', error.message);
          // On error, ensure clean state
          if (!session) {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    // Guard against null/undefined userId
    if (!userId) {
      console.warn('fetchProfile called with null/undefined userId');
      setProfile(null);
      return;
    }

    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to handle no rows gracefully

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      console.log('Profile fetched:', data ? 'Profile found' : 'No profile found');
      
      // data will be null if no profile exists, which is fine
      setProfile(data);
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      setProfile(null);
    }
  };

  const createProfile = async (fullName: string, role: string) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      console.log('Creating profile for user:', user.id);

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          role: role as any,
          care_points: 0,
        });

      if (error) throw error;

      // Fetch the created profile
      await fetchProfile(user.id);
      toast.success('Profile created successfully!');
    } catch (error: any) {
      console.error('Profile creation error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user?.id) {
        console.log('Creating profile for new user:', data.user.id);
        
        // Wait a moment for the user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            role: role as any,
            care_points: 0,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        // Fetch the created profile
        await fetchProfile(data.user.id);
      }

      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Handle session not found errors gracefully - treat as successful signout
      if (error && (
        error.message.includes('Session from session_id claim in JWT does not exist') ||
        error.message.includes('session_not_found') ||
        error.message.includes('refresh_token_not_found')
      )) {
        console.info('Session already invalid on server, clearing local state');
      } else if (error) {
        console.warn('Sign out error:', error.message);
      }
      
      // Always clear local state regardless of server response
      setSession(null);
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.warn('Unexpected sign out error:', error.message);
      // Ensure clean state even if sign out fails completely
      setSession(null);
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully!');
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};