import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Share & Care</span>
            </div>
            <p className="text-sm text-gray-300">
              Connecting hearts, sharing hope. Together, we make a difference in the lives of those who need it most.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-slate-light rounded-lg hover:bg-orange transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-light rounded-lg hover:bg-orange transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-light rounded-lg hover:bg-orange transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-orange transition-colors">Home</Link></li>
              <li><Link to="/donate" className="text-gray-300 hover:text-orange transition-colors">Donate</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-orange transition-colors">How It Works</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-orange transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Donation Categories</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Food & Groceries</li>
              <li>Clothing & Footwear</li>
              <li>Books & Education</li>
              <li>Medical Supplies</li>
              <li>Hygiene Products</li>
              <li>Toys & Games</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange" />
                <span className="text-gray-300">hello@shareandcare.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-orange" />
                <span className="text-gray-300">123 Care Street, Hope City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-light mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Share & Care. All rights reserved. Made with ❤️ for a better world.</p>
        </div>
      </div>
    </footer>
  );
};