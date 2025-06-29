import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  UserCheck, 
  Truck, 
  Heart,
  ArrowRight,
  CheckCircle,
  Users,
  Star,
  Clock,
  MapPin,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Gift,
      title: "Make a Donation",
      description: "List items you want to donate with photos and descriptions. Choose pickup or drop-off options.",
      color: "bg-orange",
      details: [
        "Upload photos of your items",
        "Provide detailed descriptions",
        "Set quantity and condition",
        "Choose collection method"
      ]
    },
    {
      icon: UserCheck,
      title: "Verification Process",
      description: "Our volunteers review and verify your donation to ensure quality and appropriateness.",
      color: "bg-blue-500",
      details: [
        "Quality assessment by volunteers",
        "Appropriateness verification",
        "Status updates via notifications",
        "Quick approval process"
      ]
    },
    {
      icon: Truck,
      title: "Collection & Delivery",
      description: "Verified donations are collected and delivered to families and individuals in need.",
      color: "bg-green",
      details: [
        "Scheduled pickup or drop-off",
        "Safe transportation",
        "Direct delivery to recipients",
        "Real-time tracking updates"
      ]
    },
    {
      icon: Heart,
      title: "Impact & Rewards",
      description: "Earn CarePoints for your generosity and see the positive impact you've made in the community.",
      color: "bg-pink-500",
      details: [
        "Earn 10 CarePoints per donation",
        "Track your community impact",
        "Unlock achievement levels",
        "Join our recognition program"
      ]
    }
  ];

  const userTypes = [
    {
      title: "Donors",
      icon: Gift,
      color: "bg-orange",
      description: "Share items you no longer need with those who can benefit from them",
      features: [
        "Easy donation listing",
        "Photo upload capability",
        "Flexible pickup options",
        "CarePoints rewards system",
        "Impact tracking dashboard"
      ]
    },
    {
      title: "Volunteers",
      icon: UserCheck,
      color: "bg-blue-500",
      description: "Help verify donations and coordinate deliveries to make a direct impact",
      features: [
        "Donation verification tools",
        "Delivery coordination",
        "Community impact reports",
        "Volunteer recognition",
        "Flexible scheduling"
      ]
    },
    {
      title: "Recipients",
      icon: Users,
      color: "bg-green",
      description: "Access essential items and support from your caring community",
      features: [
        "Browse available donations",
        "Request needed items",
        "Direct community support",
        "Privacy protection",
        "Dignified assistance"
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your personal information is protected with enterprise-grade security"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Track your donations from listing to delivery with live status updates"
    },
    {
      icon: MapPin,
      title: "Local Community",
      description: "Connect with neighbors and local organizations in your area"
    },
    {
      icon: Star,
      title: "Recognition System",
      description: "Earn CarePoints and unlock achievements for your generous contributions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-green/10" />
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
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
              <Heart className="h-12 w-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate leading-tight">
              How It
              <span className="block text-orange">Works</span>
            </h1>
            
            <p className="text-xl text-slate-light max-w-3xl mx-auto">
              Our platform makes it simple to share, care, and make a meaningful difference 
              in your community. Here's how we connect generous hearts with those in need.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate mb-4">
              Simple Steps to Make a Difference
            </h2>
            <p className="text-xl text-slate-light max-w-2xl mx-auto">
              From donation to delivery, our streamlined process ensures your generosity reaches those who need it most
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 ${step.color} rounded-2xl`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-slate-light">
                          Step {index + 1}
                        </span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate">{step.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-lg text-slate-light leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green flex-shrink-0" />
                        <span className="text-slate">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1">
                  <Card className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="text-center space-y-4">
                      <div className={`inline-flex p-6 ${step.color} rounded-3xl`}>
                        <step.icon className="h-16 w-16 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-slate">{step.title}</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${step.color} transition-all duration-1000`}
                          style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-light">
                        {index + 1} of {steps.length} steps completed
                      </p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-slate-light max-w-2xl mx-auto">
              Whether you want to give, help, or receive support, there's a place for you in our caring community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full text-center group hover:shadow-xl transition-all duration-300">
                  <div className={`inline-flex p-4 ${type.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate mb-4">{type.title}</h3>
                  <p className="text-slate-light mb-6">{type.description}</p>
                  <ul className="space-y-3 text-left">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green flex-shrink-0" />
                        <span className="text-sm text-slate">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-light max-w-2xl mx-auto">
              Built with care, designed for impact, and focused on bringing communities together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full group hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-orange/10 rounded-xl inline-block mb-4 group-hover:bg-orange group-hover:text-white transition-colors">
                    <feature.icon className="h-8 w-8 text-orange group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate mb-3">{feature.title}</h3>
                  <p className="text-slate-light text-sm">{feature.description}</p>
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
              Ready to Start Making a Difference?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of caring individuals who are already transforming lives through simple acts of sharing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="outline" size="lg" className="bg-white text-orange border-white hover:bg-gray-100">
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur">
                  Start Donating Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};