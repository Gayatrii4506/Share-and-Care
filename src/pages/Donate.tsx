import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Upload,
  MapPin,
  Check,
  ArrowLeft,
  ArrowRight,
  Apple,
  Shirt,
  BookOpen,
  Pill,
  Sparkles,
  Gamepad2,
  User,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface DonationData {
  itemName: string;
  category: string;
  quantity: number;
  condition: string;
  description: string;
  pickupOption: boolean;
  imageFile?: File;
}

interface ProfileSetupData {
  fullName: string;
  role: string;
}

export const Donate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileSetupData, setProfileSetupData] = useState<ProfileSetupData>({
    fullName: '',
    role: 'donor',
  });
  const [donationData, setDonationData] = useState<DonationData>({
    itemName: '',
    category: '',
    quantity: 1,
    condition: 'good',
    description: '',
    pickupOption: true,
  });

  const { user, profile, loading: authLoading, createProfile } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: 'food', label: 'Food & Groceries', icon: Apple, color: 'bg-red-100 text-red-600' },
    { value: 'clothing', label: 'Clothing', icon: Shirt, color: 'bg-blue-100 text-blue-600' },
    { value: 'books', label: 'Books', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    { value: 'medicine', label: 'Medicine', icon: Pill, color: 'bg-green-100 text-green-600' },
    { value: 'hygiene', label: 'Hygiene', icon: Sparkles, color: 'bg-pink-100 text-pink-600' },
    { value: 'toys', label: 'Toys', icon: Gamepad2, color: 'bg-yellow-100 text-yellow-600' }
  ];

  const steps = [
    { id: 1, title: 'Category', description: 'Choose what you want to donate' },
    { id: 2, title: 'Details', description: 'Tell us about your item' },
    { id: 3, title: 'Logistics', description: 'Pickup or drop-off options' },
    { id: 4, title: 'Confirm', description: 'Review and submit' },
  ];

  // Handle authentication redirects in useEffect
  useEffect(() => {
    // Only redirect if auth loading is complete and user is not authenticated
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  // Check if profile setup is needed
  useEffect(() => {
    if (!authLoading && user && !profile) {
      console.log('User exists but no profile, showing profile setup');
      setShowProfileSetup(true);
    } else if (profile) {
      setShowProfileSetup(false);
    }
  }, [authLoading, user, profile]);

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileSetupData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      await createProfile(profileSetupData.fullName, profileSetupData.role);
      setShowProfileSetup(false);
      toast.success('Profile created! You can now make donations.');
    } catch (error) {
      console.error('Profile creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => setCurrentStep(Math.max(currentStep - 1, 1));
  const handleNext = () => setCurrentStep(Math.min(currentStep + 1, steps.length));

  const handleSubmit = async () => {
    if (!donationData.itemName.trim() || !donationData.category) {
      toast.error('Please complete all required fields');
      return;
    }
    
    // Guard against null profile or user
    if (!profile?.id || !user?.id) {
      toast.error('Profile not loaded. Please try refreshing the page.');
      return;
    }
    
    setLoading(true);
    try {
      let imageUrl = '';
      if (donationData.imageFile) {
        const fileExt = donationData.imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('donations').upload(fileName, donationData.imageFile);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('donations').getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      const { error: donationError } = await supabase.from('donations').insert({
        donor_id: profile.id,
        item_name: donationData.itemName.trim(),
        category: donationData.category,
        quantity: donationData.quantity,
        condition: donationData.condition,
        description: donationData.description.trim(),
        pickup_option: donationData.pickupOption,
        image_url: imageUrl || null,
        status: 'requested',
      });

      if (donationError) throw donationError;

      // Update user's care points - guard against null values
      const currentPoints = profile?.care_points || 0;
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({ care_points: currentPoints + 10 })
        .eq('id', profile.id);

      if (pointsError) console.warn('Error updating points:', pointsError);

      toast.success('Donation submitted successfully! You earned 10 CarePoints!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Donation submission error:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate mb-6">What would you like to donate?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.value}
                  onClick={() => setDonationData({ ...donationData, category: category.value })}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    donationData.category === category.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate">{category.label}</h4>
                      <p className="text-sm text-slate-light">Help families in need</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate mb-6">Tell us about your item</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate mb-2">Item Name *</label>
              <input
                type="text"
                value={donationData.itemName}
                onChange={(e) => setDonationData({ ...donationData, itemName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/25 focus:border-primary"
                placeholder="e.g., Winter jacket, Rice bags, Mathematics textbook"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={donationData.quantity}
                  onChange={(e) => setDonationData({ ...donationData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/25 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">Condition</label>
                <select
                  value={donationData.condition}
                  onChange={(e) => setDonationData({ ...donationData, condition: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/25 focus:border-primary"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">Description</label>
              <textarea
                rows={4}
                value={donationData.description}
                onChange={(e) => setDonationData({ ...donationData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/25 focus:border-primary"
                placeholder="Provide additional details about the item, size, color, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">Photo (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDonationData({ 
                    ...donationData, 
                    imageFile: e.target.files?.[0] 
                  })}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-primary hover:text-primary-light"
                >
                  {donationData.imageFile ? donationData.imageFile.name : 'Click to upload a photo'}
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate mb-6">How should we collect your donation?</h3>
            
            <div className="space-y-4">
              <div
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  donationData.pickupOption
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => setDonationData({ ...donationData, pickupOption: true })}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-secondary rounded-xl">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate">Pickup from my location</h4>
                    <p className="text-sm text-slate-light">Our volunteers will collect the item from you</p>
                  </div>
                  {donationData.pickupOption && (
                    <Check className="h-6 w-6 text-primary" />
                  )}
                </div>
              </div>

              <div
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  !donationData.pickupOption
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => setDonationData({ ...donationData, pickupOption: false })}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate">Drop-off at collection point</h4>
                    <p className="text-sm text-slate-light">Bring your donation to a nearby collection center</p>
                  </div>
                  {!donationData.pickupOption && (
                    <Check className="h-6 w-6 text-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate mb-6">Review your donation</h3>
            
            <Card className="bg-cream">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-light">Item:</span>
                  <span className="font-medium text-slate">{donationData.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Category:</span>
                  <span className="font-medium text-slate">
                    {categories.find(c => c.value === donationData.category)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Quantity:</span>
                  <span className="font-medium text-slate">{donationData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Condition:</span>
                  <span className="font-medium text-slate capitalize">{donationData.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Collection:</span>
                  <span className="font-medium text-slate">
                    {donationData.pickupOption ? 'Pickup' : 'Drop-off'}
                  </span>
                </div>
                {donationData.description && (
                  <div>
                    <span className="text-slate-light">Description:</span>
                    <p className="font-medium text-slate mt-1">{donationData.description}</p>
                  </div>
                )}
                {donationData.imageFile && (
                  <div>
                    <span className="text-slate-light">Photo:</span>
                    <p className="font-medium text-slate mt-1">{donationData.imageFile.name}</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="bg-secondary/10 p-4 rounded-xl">
              <p className="text-secondary font-medium text-center">
                🎉 You'll earn 10 CarePoints for this donation!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold mb-4 mt-4">Loading...</h2>
          <p>Please wait while we prepare your donation form.</p>
        </Card>
      </div>
    );
  }

  // Show loading if user is not available (will redirect via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold mb-4 mt-4">Redirecting...</h2>
          <p>Please wait while we redirect you to login.</p>
        </Card>
      </div>
    );
  }

  // Show profile setup form if needed
  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center mb-6">
              <div className="p-4 bg-primary rounded-full inline-block mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate mb-2">Complete Your Profile</h2>
              <p className="text-slate-light">We need a few details to set up your donation profile</p>
            </div>

            <form onSubmit={handleProfileSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-light" />
                  <input
                    type="text"
                    value={profileSetupData.fullName}
                    onChange={(e) => setProfileSetupData({ ...profileSetupData, fullName: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/25 focus:border-primary"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-light" />
                  <input
                    type="email"
                    value={user.email || ''}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">Role</label>
                <select
                  value={profileSetupData.role}
                  onChange={(e) => setProfileSetupData({ ...profileSetupData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/25 focus:border-primary"
                >
                  <option value="donor">Donor - I want to donate items</option>
                  <option value="volunteer">Volunteer - I want to help deliver donations</option>
                </select>
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Complete Profile & Continue
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading if profile is not available yet - but allow proceeding if user exists
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold mb-4 mt-4">Setting up your profile...</h2>
          <p className="text-slate-light">Please wait while we prepare your account.</p>
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.id
                        ? 'bg-primary border-primary text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !donationData.category) ||
                (currentStep === 2 && !donationData.itemName.trim())
              }
              className="flex items-center"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!donationData.itemName.trim() || !donationData.category}
              className="flex items-center"
            >
              Submit Donation
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};