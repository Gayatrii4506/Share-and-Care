import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { ChartPieDonut } from '../components/UI/ChartPieDonut';
import { LogOut } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Donation {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  condition: string;
  description: string;
  pickup_option: boolean;
  status: string;
  created_at: string;
  donor_id: string;
  volunteer_id?: string;
  ngo_id?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface NGO {
  id: string;
  name: string;
  contact_info: string;
}

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'donor' | 'volunteer' | 'admin';
  care_points: number;
  created_at: string;
  suspended?: boolean;
}

const DONATION_STATUSES = ['requested', 'verified', 'picked', 'delivered'];

export const AdminDashboard: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [newNgo, setNewNgo] = useState({ name: '', contact_info: '' });
  const [editNgoId, setEditNgoId] = useState<string | null>(null);
  const [editNgo, setEditNgo] = useState({ name: '', contact_info: '' });
  const [ngoLoading, setNgoLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    categoryCounts: {} as Record<string, number>,
    monthlyCounts: {} as Record<string, number>,
    topItems: [] as { name: string; count: number }[],
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    fetchDonations();
    fetchNgos();
    fetchVolunteers();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [donations]);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*, profiles:donor_id(full_name, email)');
    if (!error && data) setDonations(data);
  };

  const fetchNgos = async () => {
    const { data, error } = await supabase
      .from('ngos')
      .select('*');
    if (!error && data) setNgos(data);
  };

  const fetchVolunteers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'volunteer');
    if (!error && data) setVolunteers(data);
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (!error && data) setUsers(data);
    setUserLoading(false);
  };

  const fetchAnalytics = () => {
    // Group by category
    const categoryCounts: Record<string, number> = {};
    const itemCounts: Record<string, number> = {};
    const monthlyCounts: Record<string, number> = {};
    donations.forEach((donation) => {
      // Category
      categoryCounts[donation.category] = (categoryCounts[donation.category] || 0) + 1;
      // Item
      itemCounts[donation.item_name] = (itemCounts[donation.item_name] || 0) + 1;
      // Month
      const month = new Date(donation.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    // Top items
    const topItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setAnalytics({ categoryCounts, monthlyCounts, topItems });
  };

  const handleAssignNgo = async (donationId: string, ngoId: string) => {
    await supabase
      .from('donations')
      .update({ ngo_id: ngoId })
      .eq('id', donationId);
    fetchDonations();
  };

  const handleAssignVolunteer = async (donationId: string, volunteerId: string) => {
    await supabase
      .from('donations')
      .update({ volunteer_id: volunteerId })
      .eq('id', donationId);
    fetchDonations();
  };

  const handleStatusChange = async (donationId: string, status: string) => {
    await supabase
      .from('donations')
      .update({ status })
      .eq('id', donationId);
    fetchDonations();
  };

  const handleAddNgo = async (e: React.FormEvent) => {
    e.preventDefault();
    setNgoLoading(true);
    const { error } = await supabase
      .from('ngos')
      .insert([{ name: newNgo.name, contact_info: newNgo.contact_info }]);
    if (!error) {
      setNewNgo({ name: '', contact_info: '' });
      fetchNgos();
    }
    setNgoLoading(false);
  };

  const handleEditNgo = (ngo: NGO) => {
    setEditNgoId(ngo.id);
    setEditNgo({ name: ngo.name, contact_info: ngo.contact_info });
  };

  const handleSaveNgo = async (ngoId: string) => {
    setNgoLoading(true);
    await supabase
      .from('ngos')
      .update({ name: editNgo.name, contact_info: editNgo.contact_info })
      .eq('id', ngoId);
    setEditNgoId(null);
    setEditNgo({ name: '', contact_info: '' });
    fetchNgos();
    setNgoLoading(false);
  };

  const handleDeleteNgo = async (ngoId: string) => {
    if (!window.confirm('Are you sure you want to delete this NGO?')) return;
    setNgoLoading(true);
    await supabase
      .from('ngos')
      .delete()
      .eq('id', ngoId);
    fetchNgos();
    setNgoLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setUserLoading(true);
    await supabase.from('profiles').delete().eq('id', userId);
    fetchUsers();
    setUserLoading(false);
  };

  const handleSuspendUser = async (userId: string, suspended: boolean) => {
    setUserLoading(true);
    await supabase.from('profiles').update({ suspended: !suspended }).eq('id', userId);
    fetchUsers();
    setUserLoading(false);
  };

  const handlePromoteToAdmin = async (userId: string) => {
    setUserLoading(true);
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
    fetchUsers();
    setUserLoading(false);
  };

  const handleSignOut = async () => {
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      console.log('AdminDashboard: Signing out...');
      setIsSigningOut(true);
      timeoutId = setTimeout(() => {
        setIsSigningOut(false);
        console.error('AdminDashboard: Sign out timed out after 5 seconds');
        alert('Sign out is taking too long. Please refresh the page.');
      }, 5000);
      await signOut();
      console.log('AdminDashboard: Sign out completed successfully');
      navigate('/');
      setTimeout(() => {
        console.log('AdminDashboard: After signOut, user:', user);
        console.log('AdminDashboard: After signOut, profile:', profile);
      }, 500);
    } catch (error) {
      console.error('AdminDashboard: Error signing out:', error);
      alert('An error occurred during sign out. Please try again.');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsSigningOut(false);
    }
  };

  // Prepare sorted pie chart data for shadcn/ui donut chart with pastel colors
  const pieChartData = Object.entries(analytics.categoryCounts)
    .map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      fill: [
        '#6C63FF', // soft indigo
        '#FF6B6B', // coral
        '#FFD166', // soft yellow
        '#06D6A0', // teal
        '#4ECDC4', // turquoise
        '#FFB5E8', // pink
      ][i % 6],
    }))
    .sort((a, b) => b.value - a.value);

  const barData = {
    labels: Object.keys(analytics.monthlyCounts),
    datasets: [
      {
        label: 'Donations per Month',
        data: Object.values(analytics.monthlyCounts),
        backgroundColor: '#A084E8', // pastel purple
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut} className="mt-4 md:mt-0 flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </div>

        {/* Analytics Section */}
        <Card className="mb-8">
          <CardHeader className="items-center pb-0">
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Donation trends and insights</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ChartPieDonut data={pieChartData} title="Donations by Category" description="Current year" />
            <div className="rounded-2xl p-4 shadow">
              <h3 className="font-semibold mb-2">Donations per Month</h3>
              <Bar data={barData} />
              <h3 className="font-semibold mt-6 mb-2">Top Donated Items</h3>
              <ul className="list-disc pl-6">
                {analytics.topItems.map(item => (
                  <li key={item.name}>{item.name} <span className="text-slate-light">({item.count} donations)</span></li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">All Donations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-cream">
                  <th className="p-2">Item</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Donor</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Collected By</th>
                  <th className="p-2">Assign Volunteer</th>
                  <th className="p-2">Assigned NGO</th>
                  <th className="p-2">Assign NGO</th>
                  <th className="p-2">Change Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="p-2">{donation.item_name}</td>
                    <td className="p-2">{donation.category}</td>
                    <td className="p-2">{donation.profiles?.full_name || 'N/A'}</td>
                    <td className="p-2 capitalize">{donation.status}</td>
                    <td className="p-2">
                      {volunteers.find(v => v.id === donation.volunteer_id)?.full_name || 'N/A'}
                    </td>
                    <td className="p-2">
                      <select
                        value={donation.volunteer_id || ''}
                        onChange={e => handleAssignVolunteer(donation.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Unassigned</option>
                        {volunteers.map(vol => (
                          <option key={vol.id} value={vol.id}>{vol.full_name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      {ngos.find(n => n.id === donation.ngo_id)?.name || 'N/A'}
                    </td>
                    <td className="p-2">
                      <select
                        value={donation.ngo_id || ''}
                        onChange={e => handleAssignNgo(donation.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Unassigned</option>
                        {ngos.map(ngo => (
                          <option key={ngo.id} value={ngo.id}>{ngo.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={donation.status}
                        onChange={e => handleStatusChange(donation.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        {DONATION_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">{new Date(donation.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Manage NGOs</h2>
          <form onSubmit={handleAddNgo} className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="NGO Name"
              value={newNgo.name}
              onChange={e => setNewNgo({ ...newNgo, name: e.target.value })}
              className="border rounded-xl py-2 px-3 flex-1"
              required
            />
            <input
              type="text"
              placeholder="Contact Info"
              value={newNgo.contact_info}
              onChange={e => setNewNgo({ ...newNgo, contact_info: e.target.value })}
              className="border rounded-xl py-2 px-3 flex-1"
              required
            />
            <Button type="submit" loading={ngoLoading}>Add NGO</Button>
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-cream">
                  <th className="p-2">Name</th>
                  <th className="p-2">Contact Info</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ngos.map(ngo => (
                  <tr key={ngo.id} className="border-b">
                    <td className="p-2">
                      {editNgoId === ngo.id ? (
                        <input
                          type="text"
                          value={editNgo.name}
                          onChange={e => setEditNgo({ ...editNgo, name: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        ngo.name
                      )}
                    </td>
                    <td className="p-2">
                      {editNgoId === ngo.id ? (
                        <input
                          type="text"
                          value={editNgo.contact_info}
                          onChange={e => setEditNgo({ ...editNgo, contact_info: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        ngo.contact_info
                      )}
                    </td>
                    <td className="p-2">
                      {editNgoId === ngo.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSaveNgo(ngo.id)} loading={ngoLoading}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditNgoId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEditNgo(ngo)}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteNgo(ngo.id)} loading={ngoLoading}>Delete</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* User Management Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, suspend, delete, or promote users</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-cream">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Care Points</th>
                  <th className="p-2">Joined</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.full_name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                    <td className="p-2">{user.care_points}</td>
                    <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleSuspendUser(user.id, !!user.suspended)}>
                        {user.suspended ? 'Unsuspend' : 'Suspend'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </Button>
                      {user.role === 'volunteer' && (
                        <Button size="sm" variant="outline" onClick={() => handlePromoteToAdmin(user.id)}>
                          Promote to Admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 