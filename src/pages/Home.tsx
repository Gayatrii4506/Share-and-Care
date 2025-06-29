import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Gift, 
  TrendingUp,
  Apple,
  Shirt,
  BookOpen,
  Pill,
  Sparkles,
  Gamepad2,
  ArrowRight,
  Star,
  Quote
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

// Custom Tooltip Component
const Tooltip: React.FC<{ children: React.ReactNode; message: string; position?: 'top' | 'bottom' | 'left' | 'right' }> = ({ 
  children, 
  message, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {message}
          <div className={`absolute w-2 h-2 bg-slate-800 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
            'right-full top-1/2 -translate-y-1/2 -mr-1'
          }`} />
        </motion.div>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    donations: 1247,
    peopleHelped: 892,
    volunteers: 156,
    itemsDelivered: 2340
  });

  const categories = [
    { name: 'Food & Groceries', icon: Apple, color: 'bg-red-100 text-red-600', count: 234 },
    { name: 'Clothing', icon: Shirt, color: 'bg-blue-100 text-blue-600', count: 189 },
    { name: 'Books', icon: BookOpen, color: 'bg-purple-100 text-purple-600', count: 156 },
    { name: 'Medicine', icon: Pill, color: 'bg-green-100 text-green-600', count: 98 },
    { name: 'Hygiene', icon: Sparkles, color: 'bg-pink-100 text-pink-600', count: 145 },
    { name: 'Toys', icon: Gamepad2, color: 'bg-yellow-100 text-yellow-600', count: 87 }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Donor",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Sharing through this platform has brought so much joy to my life. Knowing that my donations reach people who truly need them is incredibly fulfilling."
    },
    {
      name: "Michael Chen",
      role: "Volunteer",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Being a volunteer has shown me the real impact of community support. Every delivery brings smiles and hope to families."
    },
    {
      name: "Maria Rodriguez",
      role: "Recipient",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "During tough times, this community became our lifeline. The kindness and generosity here restored my faith in humanity."
    }
  ];

  // Animate stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        donations: prev.donations + Math.floor(Math.random() * 3),
        peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 2),
        volunteers: prev.volunteers + Math.floor(Math.random() * 1),
        itemsDelivered: prev.itemsDelivered + Math.floor(Math.random() * 4)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-green/10" />
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="inline-block p-4 bg-orange rounded-full mb-6"
            >
              <Heart className="h-12 w-12 text-white animate-pulse" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate leading-tight">
              Share Hope,
              <span className="block text-orange">Spread Care</span>
            </h1>
            
            <p className="text-xl text-slate-light max-w-3xl mx-auto">
              Connect with your community to share essentials with those who need them most. 
              Together, we can make a meaningful difference, one donation at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button size="lg" className="group">
                  Start Donating
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 p-3 bg-green rounded-full shadow-lg hidden lg:block"
        >
          <Tooltip message="Share your gifts with those in need! 🎁">
            <Gift className="h-6 w-6 text-white" />
          </Tooltip>
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute top-32 right-16 p-3 bg-orange rounded-full shadow-lg hidden lg:block"
        >
          <Tooltip message="Join our community of caring volunteers! 👥">
            <Users className="h-6 w-6 text-white" />
          </Tooltip>
        </motion.div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Donations', value: stats.donations, icon: Gift, color: 'text-orange' },
              { label: 'People Helped', value: stats.peopleHelped, icon: Users, color: 'text-green' },
              { label: 'Active Volunteers', value: stats.volunteers, icon: Heart, color: 'text-pink-500' },
              { label: 'Items Delivered', value: stats.itemsDelivered, icon: TrendingUp, color: 'text-blue-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex p-3 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <motion.div
                  className={`text-3xl font-bold ${stat.color} mb-2`}
                  key={stat.value}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                <p className="text-slate-light text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate mb-4">
              What Can You Share?
            </h2>
            <p className="text-xl text-slate-light max-w-2xl mx-auto">
              Every donation category helps fulfill different essential needs in our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="text-center group">
                  <div className={`inline-flex p-4 rounded-2xl ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate mb-2">{category.name}</h3>
                  <p className="text-slate-light mb-4">
                    {category.count} donations this month
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((category.count / 250) * 100, 100)}%` }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/donate">
              <Button size="lg">
                Start Your Donation Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate mb-4">
              Stories of Impact
            </h2>
            <p className="text-xl text-slate-light max-w-2xl mx-auto">
              Real experiences from our community members who are making a difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <div className="flex flex-col h-full">
                    <Quote className="h-8 w-8 text-orange mb-4" />
                    <p className="text-slate-light mb-6 flex-grow italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-slate">{testimonial.name}</h4>
                        <p className="text-sm text-slate-light">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex text-orange mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange to-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of caring individuals who are transforming lives through simple acts of sharing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="outline" size="lg" className="bg-white text-orange border-white hover:bg-gray-100">
                  Join Our Community
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur">
                  Donate Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};