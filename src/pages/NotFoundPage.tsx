import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Compass, MapPin } from 'lucide-react';
import { ROUTES } from '@/core/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Helmet>
      
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-ink rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Animated Compass Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <div className="inline-block p-6 bg-accent/20 border-4 border-ink rounded-full">
              <Compass size={64} className="text-ink" />
            </div>
          </motion.div>

          {/* Large 404 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="font-display text-[10rem] md:text-[15rem] font-bold text-ink leading-none relative">
              <span className="relative inline-block">
                4
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-accent/20 -z-10 blur-xl"
                />
              </span>
              <span className="relative inline-block mx-4">
                0
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                  className="absolute inset-0 bg-accent/20 -z-10 blur-xl rounded-full"
                />
              </span>
              <span className="relative inline-block">
                4
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                  className="absolute inset-0 bg-accent/20 -z-10 blur-xl"
                />
              </span>
            </h1>
          </motion.div>
          
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-2 bg-ink mx-auto mb-8"
            style={{ width: '200px' }}
          />

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-ink mb-4">
              Lost in the Digital Wilderness?
            </h2>
            
            <p className="font-body text-xl md:text-2xl text-ink/70 max-w-2xl mx-auto leading-relaxed">
              The page you're searching for seems to have wandered off the map. 
              Don't worry, we'll help you find your way back!
            </p>
          </motion.div>

          {/* Main Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <Link
              to={ROUTES.HOME}
              className="group px-8 py-4 bg-ink text-cream hover:bg-accent-dark border-2 border-ink transition-all font-body text-lg flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(15,15,15,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]"
            >
              <Home size={24} />
              <span>Back to Home</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft size={20} className="rotate-180" />
              </motion.div>
            </Link>
            
            <Link
              to={ROUTES.PROJECTS}
              className="px-8 py-4 bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream transition-all font-body text-lg flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(15,15,15,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]"
            >
              <Search size={24} />
              <span>Explore Projects</span>
            </Link>
          </motion.div>

          {/* Navigation Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-cream border-4 border-ink p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <MapPin className="text-accent" size={28} />
              <h3 className="font-display text-3xl font-bold text-ink">
                Quick Navigation
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { to: ROUTES.HOME, label: 'Home', icon: '🏠' },
                { to: ROUTES.PROJECTS, label: 'Projects', icon: '💼' },
                { to: ROUTES.EXPERIENCE, label: 'Experience', icon: '🎯' },
                { to: ROUTES.BLOG, label: 'Blog', icon: '📝' },
                { to: ROUTES.CONTACT, label: 'Contact', icon: '📧' },
              ].map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.to}
                    className="block p-6 bg-accent/10 border-2 border-ink hover:bg-accent/20 transition-all group"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="font-body text-lg font-semibold text-ink group-hover:text-accent-dark transition-colors">
                      {item.label}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <p className="font-body text-ink/60 text-lg">
              Still can't find what you're looking for?{' '}
              <Link 
                to={ROUTES.CONTACT} 
                className="text-accent-dark hover:text-accent underline font-semibold"
              >
                Let me know
              </Link>
              {' '}and I'll help you out!
            </p>
          </motion.div>

          {/* Fun Easter Egg */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8 text-sm text-ink/40 font-mono"
          >
            Error Code: 404 | Page Not Found | URL: {window.location.pathname}
          </motion.div>
        </div>
      </div>
    </>
  );
};