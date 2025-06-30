import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Gift, Award, TrendingUp, Globe } from 'lucide-react';

export const Impact: React.FC = () => {
  const stats = [
    {
      icon: <Heart className="h-8 w-8 text-orange" />,
      number: '1,247',
      label: 'Donations Made',
      description: 'Items shared with those in need'
    },
    {
      icon: <Users className="h-8 w-8 text-green" />,
      number: '856',
      label: 'Volunteers',
      description: 'Active community members'
    },
    {
      icon: <Gift className="h-8 w-8 text-orange" />,
      number: '2,341',
      label: 'CarePoints Earned',
      description: 'Total points distributed'
    },
    {
      icon: <Award className="h-8 w-8 text-green" />,
      number: '15',
      label: 'Partner NGOs',
      description: 'Organizations supported'
    }
  ];

  const successStories = [
    {
      title: "Sarah's Story",
      content: "Sarah, a single mother of three, received essential household items through our platform. The community's generosity helped her family get back on their feet.",
      image: "https://eelhuqlkhkjkilwngxwi.supabase.co/storage/v1/object/sign/image/women.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OGQzMTI2MC02OGRjLTRlODEtYWI1Yy1hYTU5NTMwZDE2Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZS93b21lbi5qcGciLCJpYXQiOjE3NTEyNjQ4ODEsImV4cCI6MTkwODk0NDg4MX0.LMGj31Fns0GvWNLTfC0wNmGVeCwhQwaQhz7degJD8EU"
    },
    {
      title: "Community Garden Project",
      content: "Volunteers came together to create a community garden, providing fresh produce to local families and teaching sustainable gardening practices.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
    },
    {
      title: "Tech for Education",
      content: "Donated laptops and tablets helped 50 students continue their education during challenging times, bridging the digital divide.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
    }
  ];

  const impactAreas = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Environmental Impact",
      description: "Reducing waste by giving items a second life"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Community Building",
      description: "Connecting neighbors and fostering relationships"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Social Impact",
      description: "Supporting vulnerable families and individuals"
    }
  ];

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
              Our Impact
            </h1>
            <p className="text-xl text-slate-light max-w-3xl mx-auto mb-8">
              Together, we're building a more caring and sustainable community. 
              Every donation, every volunteer hour, and every connection makes a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate mb-4">By the Numbers</h2>
            <p className="text-slate-light">The real impact of our community's generosity</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-cream rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-slate mb-2">{stat.label}</div>
                <div className="text-sm text-slate-light">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate mb-4">Success Stories</h2>
            <p className="text-slate-light">Real stories from our community members</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate mb-3">{story.title}</h3>
                  <p className="text-slate-light leading-relaxed">{story.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate mb-4">Areas of Impact</h2>
            <p className="text-slate-light">How we're making a difference across multiple dimensions</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-orange rounded-full text-white">
                    {area.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate mb-3">{area.title}</h3>
                <p className="text-slate-light">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange to-orange-light">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Join Us in Making a Difference
            </h2>
            <p className="text-xl text-white mb-8">
              Every contribution counts. Start sharing, caring, and making an impact today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-orange font-semibold rounded-xl hover:bg-cream transition-colors">
                Start Donating
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-orange transition-colors">
                Become a Volunteer
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}; 