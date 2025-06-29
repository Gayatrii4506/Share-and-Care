import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck,
  Star,
  Calendar,
  MapPin,
  User,
  LogOut,
  Heart,
  Users,
  Eye,
  Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Donation {
  id: string;
  donor_id: string;
  item_name: string;
  category: string;
  quantity: number;
  condition: string;
  description: string;
  pickup_option: boolean;
  image_url?: string;
  status: 'requested' | 'verified' | 'picked' | 'delivered';
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle authentication redirects in useEffect
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && user && !profile) {
      // If user exists but profile is null, wait a bit longer or redirect
      const timer = setTimeout(() => {
        if (!profile) {
          console.warn('Profile not loaded after timeout, redirecting to login');
          navigate('/login');
        }
      }, 5000); // Increased timeout to 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [authLoading, user, profile, navigate]);

  useEffect(() => {
    // Only fetch data if we have both user and profile
    if (user?.id && profile?.id) {
      fetchData();
    } else if (!authLoading && user && !profile) {
      // User exists but no profile - this might be a new user
      console.log('User exists but no profile found');
      setLoading(false);
    }
  }, [user, profile, authLoading]);

  const fetchData = async () => {
    try {
      // Guard against null profile
      if (!profile?.id || !profile?.role) {
        console.warn('Profile not ready for data fetching');
        setLoading(false);
        return;
      }

      if (profile.role === 'donor') {
        // Fetch user's own donations
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('donor_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDonations(data || []);
      } else if (profile.role === 'volunteer' || profile.role === 'admin') {
        // Fetch all donations for volunteers and admins
        const { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            profiles:donor_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAllDonations(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (donationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: newStatus })
        .eq('id', donationId);

      if (error) throw error;

      // Update local state
      setAllDonations(prev => 
        prev.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: newStatus as any }
            : donation
        )
      );

      toast.success('Donation status updated successfully');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="h-5 w-5 text-orange" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'picked':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <Gift className="h-5 w-5 text-green" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-orange/10 text-orange border-orange/20';
      case 'verified':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'picked':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'delivered':
        return 'bg-green/10 text-green border-green/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCarePointsLevel = (points: number) => {
    if (points >= 100) return { level: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (points >= 50) return { level: 'Silver', color: 'text-gray-600', bg: 'bg-gray-100' };
    return { level: 'Bronze', color: 'text-orange', bg: 'bg-orange/10' };
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigateToDonate = () => {
    navigate('/donate');
  };

  const handleNavigateToHome = () => {
    navigate('/');
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center">
        <Card className="text-center max-w-md">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold mb-4 mt-4">Loading...</h2>
          <p className="text-slate-light">Please wait while we prepare your dashboard.</p>
        </Card>
      </div>
    );
  }

  // Show loading if user is not available (will redirect via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center">
        <Card className="text-center max-w-md">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold mb-4 mt-4">Redirecting...</h2>
          <p className="text-slate-light">Please wait while we redirect you to login.</p>
        </Card>
      </div>
    );
  }

  // Show loading if profile is not available yet - but allow proceeding if user exists
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center">
        <Card className="text-center max-w-md">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold mb-4 mt-4">Loading Profile...</h2>
          <p className="text-slate-light">Please wait while we load your profile information.</p>
          <div className="mt-6 space-y-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/signup')}
            >
              Create Profile
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const level = getCarePointsLevel(profile?.care_points || 0);
  const userDonations = profile.role === 'donor' ? donations : [];
  const manageDonations = profile.role !== 'donor' ? allDonations : [];

  // Get tabs based on user role
  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: TrendingUp },
    ];

    if (profile.role === 'donor') {
      baseTabs.push({ id: 'donations', label: 'My Donations', icon: Gift });
    } else {
      baseTabs.push({ id: 'manage', label: 'Manage Donations', icon: Package });
    }

    baseTabs.push({ id: 'profile', label: 'Profile', icon: User });
    return baseTabs;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate mb-2">
                Welcome back, {profile?.full_name || 'Friend'}!
              </h1>
              <p className="text-slate-light">
                {profile.role === 'donor' 
                  ? 'Thank you for being part of our caring community'
                  : profile.role === 'volunteer'
                  ? 'Thank you for helping deliver hope to those in need'
                  : 'Thank you for managing our community platform'
                }
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {profile.role === 'donor' && (
                <div className={`px-4 py-2 rounded-xl ${level.bg} ${level.color} font-medium`}>
                  {level.level} Member
                </div>
              )}
              <div className="px-4 py-2 rounded-xl bg-slate text-white font-medium capitalize">
                {profile.role}
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {profile.role === 'donor' ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-orange rounded-xl inline-block mb-4">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {userDonations.length}
                  </h3>
                  <p className="text-slate-light text-sm">Total Donations</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-green rounded-xl inline-block mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {profile?.care_points || 0}
                  </h3>
                  <p className="text-slate-light text-sm">CarePoints</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-blue-500 rounded-xl inline-block mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {userDonations.filter(d => d.status === 'delivered').length}
                  </h3>
                  <p className="text-slate-light text-sm">Delivered</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-purple-500 rounded-xl inline-block mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {userDonations.filter(d => d.status !== 'delivered').length}
                  </h3>
                  <p className="text-slate-light text-sm">In Progress</p>
                </Card>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-orange rounded-xl inline-block mb-4">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {manageDonations.length}
                  </h3>
                  <p className="text-slate-light text-sm">Total Donations</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-yellow-500 rounded-xl inline-block mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {manageDonations.filter(d => d.status === 'requested').length}
                  </h3>
                  <p className="text-slate-light text-sm">Pending Review</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-blue-500 rounded-xl inline-block mb-4">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {manageDonations.filter(d => d.status === 'picked').length}
                  </h3>
                  <p className="text-slate-light text-sm">In Transit</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="text-center">
                  <div className="p-3 bg-green rounded-xl inline-block mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate mb-1">
                    {manageDonations.filter(d => d.status === 'delivered').length}
                  </h3>
                  <p className="text-slate-light text-sm">Delivered</p>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {getTabs().map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange text-orange'
                      : 'border-transparent text-slate-light hover:text-slate hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-semibold text-slate mb-4 flex items-center">
                  <Heart className="h-6 w-6 text-orange mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {profile.role === 'donor' ? (
                    <>
                      <Button 
                        onClick={handleNavigateToDonate} 
                        className="w-full justify-start"
                      >
                        <Gift className="h-5 w-5 mr-3" />
                        Make a New Donation
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('donations')}
                        className="w-full justify-start"
                      >
                        <Eye className="h-5 w-5 mr-3" />
                        View My Donations
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => setActiveTab('manage')}
                        className="w-full justify-start"
                      >
                        <Package className="h-5 w-5 mr-3" />
                        Review Donations
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('manage')}
                        className="w-full justify-start"
                      >
                        <Edit3 className="h-5 w-5 mr-3" />
                        Update Status
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-slate mb-4 flex items-center">
                  <Users className="h-6 w-6 text-green mr-2" />
                  Community Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-light">Your Role</span>
                    <span className="font-semibold text-slate capitalize">{profile.role}</span>
                  </div>
                  {profile.role === 'donor' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-light">CarePoints Earned</span>
                        <span className="font-semibold text-orange">{profile.care_points || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-light">Items Donated</span>
                        <span className="font-semibold text-green">{userDonations.length}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-light">Member Since</span>
                    <span className="font-semibold text-slate">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'donations' && profile.role === 'donor' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {userDonations.length === 0 ? (
              <Card className="text-center py-12">
                <Package className="h-16 w-16 text-slate-light mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate mb-2">No donations yet</h3>
                <p className="text-slate-light mb-6">
                  Start your journey of sharing by making your first donation
                </p>
                <Button onClick={handleNavigateToDonate}>
                  Make Your First Donation
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userDonations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate mb-1">
                            {donation.item_name}
                          </h3>
                          <p className="text-sm text-slate-light capitalize">
                            {donation.category} • Qty: {donation.quantity}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(donation.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(donation.status)}
                            <span className="capitalize">{donation.status}</span>
                          </div>
                        </div>
                      </div>

                      {donation.image_url && (
                        <img
                          src={donation.image_url}
                          alt={donation.item_name}
                          className="w-full h-32 object-cover rounded-xl mb-4"
                        />
                      )}

                      <p className="text-sm text-slate-light mb-4 line-clamp-2">
                        {donation.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-light">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(donation.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{donation.pickup_option ? 'Pickup' : 'Drop-off'}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'manage' && (profile.role === 'volunteer' || profile.role === 'admin') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {manageDonations.length === 0 ? (
              <Card className="text-center py-12">
                <Package className="h-16 w-16 text-slate-light mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate mb-2">No donations to manage</h3>
                <p className="text-slate-light">
                  All donations are currently up to date
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {manageDonations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {donation.image_url && (
                              <img
                                src={donation.image_url}
                                alt={donation.item_name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate mb-1">
                                {donation.item_name}
                              </h3>
                              <p className="text-sm text-slate-light mb-2">
                                <span className="capitalize">{donation.category}</span> • 
                                Qty: {donation.quantity} • 
                                Condition: <span className="capitalize">{donation.condition}</span>
                              </p>
                              <p className="text-sm text-slate-light mb-2">
                                Donor: {donation.profiles?.full_name || 'Unknown'}
                              </p>
                              {donation.description && (
                                <p className="text-sm text-slate-light line-clamp-2">
                                  {donation.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(donation.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(donation.status)}
                              <span className="capitalize">{donation.status}</span>
                            </div>
                          </div>
                          
                          <select
                            value={donation.status}
                            onChange={(e) => updateDonationStatus(donation.id, e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange/25 focus:border-orange"
                          >
                            <option value="requested">Requested</option>
                            <option value="verified">Verified</option>
                            <option value="picked">Picked Up</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Card>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-orange rounded-full">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate">
                      {profile?.full_name}
                    </h3>
                    <p className="text-slate-light">{profile?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">
                      Role
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-slate capitalize">
                      {profile?.role}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">
                      Member Since
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-slate">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {profile.role === 'donor' && (
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-slate mb-4">CarePoints Progress</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-light">Current Points</span>
                        <span className="font-bold text-orange text-xl">
                          {profile?.care_points || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange h-3 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(((profile?.care_points || 0) / 100) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-slate-light">
                        <span>Bronze (0)</span>
                        <span>Silver (50)</span>
                        <span>Gold (100)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};