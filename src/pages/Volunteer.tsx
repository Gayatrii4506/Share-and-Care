import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, MapPin, Heart, Star, Calendar, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Volunteer: React.FC = () => {
  const { user, profile } = useAuth();
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);

  const volunteerOpportunities = [
    {
      id: 1,
      title: "Donation Pickup Coordinator",
      description: "Help coordinate and pick up donations from donors across the city",
      location: "Various locations",
      duration: "2-4 hours/week",
      requirements: "Valid driver's license, good communication skills",
      points: 50,
      icon: <Heart className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Community Outreach",
      description: "Spread awareness about our platform and help new users get started",
      location: "Local communities",
      duration: "3-5 hours/week",
      requirements: "Friendly personality, good public speaking skills",
      points: 40,
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Event Organizer",
      description: "Help organize community events and donation drives",
      location: "Community centers",
      duration: "4-6 hours/week",
      requirements: "Organizational skills, event planning experience",
      points: 60,
      icon: <Calendar className="h-6 w-6" />
    },
    {
      id: 4,
      title: "Social Media Ambassador",
      description: "Help manage our social media presence and create engaging content",
      location: "Remote",
      duration: "2-3 hours/week",
      requirements: "Social media experience, creative writing skills",
      points: 35,
      icon: <Star className="h-6 w-6" />
    }
  ];

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-orange" />,
      title: "Make a Difference",
      description: "Directly impact lives in your community"
    },
    {
      icon: <Star className="h-8 w-8 text-green" />,
      title: "Earn CarePoints",
      description: "Gain points for every hour of volunteer work"
    },
    {
      icon: <Users className="h-8 w-8 text-orange" />,
      title: "Build Community",
      description: "Connect with like-minded individuals"
    },
    {
      icon: <Clock className="h-8 w-8 text-green" />,
      title: "Flexible Schedule",
      description: "Volunteer when it works for you"
    }
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      role: "Volunteer since 2022",
      content: "Volunteering with Share & Care has been incredibly rewarding. I've met amazing people and helped so many families in need.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "David Chen",
      role: "Pickup Coordinator",
      content: "The flexibility of the volunteer program is perfect for my busy schedule. I can make a difference while working around my commitments.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Sarah Johnson",
      role: "Community Outreach",
      content: "I love being part of something bigger than myself. The community we've built is truly special.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const handleVolunteerSignup = (opportunityId: number) => {
    if (!user) {
      // Redirect to login if not authenticated
      return;
    }
    setSelectedOpportunity(opportunityId);
    // Here you would typically make an API call to sign up for the opportunity
    console.log(`Signing up for opportunity ${opportunityId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate mb-6">
              Become a Volunteer
            </h1>
            <p className="text-xl text-slate-light max-w-3xl mx-auto mb-8">
              Join our community of volunteers and help make a difference in people's lives. 
              Every hour you give creates positive change.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors"
                >
                  Sign Up to Volunteer
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-orange text-orange font-semibold rounded-xl hover:bg-orange hover:text-white transition-colors"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg text-slate mb-4">
                  Welcome back, {profile?.full_name || user.email}!
                </p>
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors"
                >
                  View Your Dashboard
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate mb-4">Why Volunteer With Us?</h2>
            <p className="text-slate-light">Discover the benefits of joining our volunteer community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate mb-3">{benefit.title}</h3>
                <p className="text-slate-light">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate mb-4">Volunteer Opportunities</h2>
            <p className="text-slate-light">Find the perfect role that matches your skills and interests</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange rounded-lg text-white">
                      {opportunity.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate">{opportunity.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange">{opportunity.points}</div>
                    <div className="text-sm text-slate-light">points/hr</div>
                  </div>
                </div>
                
                <p className="text-slate-light mb-4">{opportunity.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-slate">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate">
                    <Clock className="h-4 w-4" />
                    <span>{opportunity.duration}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-slate mb-2">Requirements:</h4>
                  <p className="text-sm text-slate-light">{opportunity.requirements}</p>
                </div>
                
                <button
                  onClick={() => handleVolunteerSignup(opportunity.id)}
                  disabled={!user}
                  className="w-full px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {user ? 'Sign Up for This Role' : 'Sign In to Volunteer'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate mb-4">What Our Volunteers Say</h2>
            <p className="text-slate-light">Hear from our amazing volunteer community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-cream rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-slate">{testimonial.name}</h4>
                    <p className="text-sm text-slate-light">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-light italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange to-orange-light">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white mb-8">
              Have questions about volunteering? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 text-white">
                <Mail className="h-5 w-5" />
                <span>volunteer@shareandcare.org</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Phone className="h-5 w-5" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}; 