// Signup.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, profile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await signUp(formData.email, formData.password, formData.fullName, formData.role);
      toast.success("Account created!");
      // Fetch the latest profile directly
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
      navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream to-white">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-light" />
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10 w-full border rounded-xl py-2 px-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-light" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full border rounded-xl py-2 px-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-light" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 w-full border rounded-xl py-2 px-3"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-light" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 pr-10 w-full border rounded-xl py-2 px-3"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-xl py-2 px-3"
              required
            >
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Sign Up
          </Button>
          <p className="text-center text-sm text-slate-light">
            Already have an account? <Link to="/login" className="text-green font-medium">Log in</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
