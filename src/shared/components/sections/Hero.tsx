import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/routes';
import { SOCIAL_LINKS } from '@/shared/constants';

export const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image - Add your image to public/images/hero-background.jpg */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/hero-background.jpg)',
          filter: 'brightness(0.3)', // Darken background for text readability
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/90 to-cream/95" />

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-dark rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-body text-xl md:text-2xl text-accent-dark mb-4 block"
              >
                Hello, I'm
              </motion.span>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink mb-6">
                Your Name
              </h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-2 bg-accent mb-8"
                style={{ width: '200px' }}
              />

              <p className="font-body text-xl md:text-2xl text-ink/80 mb-8 leading-relaxed">
                Full Stack Developer crafting elegant solutions to complex problems
              </p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link
                  to={ROUTES.PROJECTS}
                  className="px-8 py-3 bg-ink text-cream hover:bg-accent-dark border-2 border-ink transition-all font-body text-lg"
                >
                  View My Work
                </Link>
                <Link
                  to={ROUTES.CONTACT}
                  className="px-8 py-3 bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream transition-all font-body text-lg"
                >
                  Get In Touch
                </Link>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex gap-4"
              >
                <a
                  href={SOCIAL_LINKS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-accent transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={28} />
                </a>
                <a
                  href={SOCIAL_LINKS.LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={28} />
                </a>
                <a
                  href={SOCIAL_LINKS.EMAIL}
                  className="text-ink hover:text-accent transition-colors"
                  aria-label="Email"
                >
                  <Mail size={28} />
                </a>
              </motion.div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative">
                {/* Add your image to public/images/profile.jpg */}
                <div className="w-80 h-80 border-4 border-ink shadow-[16px_16px_0px_0px_rgba(15,15,15,1)]">
                  <img
                    src="/images/profile.jpg"
                    alt="Your Name"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="320"%3E%3Crect fill="%23c9a96e" width="320" height="320"/%3E%3Ctext x="50%25" y="50%25" font-size="60" fill="%23faf8f4" text-anchor="middle" dy=".3em" font-family="serif"%3EYN%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                
                {/* Decorative elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent border-2 border-ink"
                />
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDown size={32} className="text-accent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
