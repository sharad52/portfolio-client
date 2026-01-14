import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Code, Award, Users, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/routes';
import { SOCIAL_LINKS } from '@/shared/constants';

export const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/hero-background.jpg)',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-cream/50 to-cream/40" />

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-dark rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
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
                Sharad Bhandari
              </h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-2 bg-accent mb-8"
                style={{ width: '200px' }}
              />

              {/* Enhanced Description */}
              <div className="mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
                  Senior Software Engineer
                </h2>
                <p className="font-body text-lg md:text-xl text-ink/80 leading-relaxed mb-4">
                  Specializing in building scalable web applications with{' '}
                  <span className="font-bold text-accent-dark">Python, React, and TypeScript</span>.
                  Passionate about clean code, system architecture, and delivering exceptional user experiences.
                </p>
                
                {/* Key Highlights */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="flex items-center gap-2 text-ink/70">
                    <Award className="text-accent" size={20} />
                    <span className="font-body font-semibold">6+ Years Exp.</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink/70">
                    <Code className="text-accent" size={20} />
                    <span className="font-body font-semibold">20+ Projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink/70">
                    <Users className="text-accent" size={20} />
                    <span className="font-body font-semibold">Team Leader</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink/70">
                    <Rocket className="text-accent" size={20} />
                    <span className="font-body font-semibold">AWS Certified</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link
                  to={ROUTES.PROJECTS}
                  className="px-8 py-3 bg-ink text-cream hover:bg-accent-dark border-2 border-ink transition-all font-body text-lg shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,15,15,1)]"
                >
                  View My Work
                </Link>
                <Link
                  to={ROUTES.CONTACT}
                  className="px-8 py-3 bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream transition-all font-body text-lg shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,15,15,1)]"
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
                <div className="w-80 h-80 border-4 border-ink shadow-[16px_16px_0px_0px_rgba(15,15,15,1)]">
                  <img
                    src="/images/profile.jpeg"
                    alt="Your Name"
                    className="w-full h-full object-cover"
                    onError={(e) => {
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

          {/* Tech Stack Section - Key Technologies at First Glance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="border-4 border-ink bg-cream p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]"
          >
            <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
              Core Technologies & Expertise
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Backend */}
              <div className="text-center">
                <div className="mb-3">
                  <span className="font-body text-sm text-accent-dark font-bold uppercase tracking-wider">
                    Backend
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    Python / FastAPI
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    C / C++
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    GraphQL
                  </div>
                </div>
              </div>

              {/* Frontend */}
              <div className="text-center">
                <div className="mb-3">
                  <span className="font-body text-sm text-accent-dark font-bold uppercase tracking-wider">
                    Frontend
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    React & Next.js
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    TypeScript
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    Tailwind CSS
                  </div>
                </div>
              </div>

              {/* Database */}
              <div className="text-center">
                <div className="mb-3">
                  <span className="font-body text-sm text-accent-dark font-bold uppercase tracking-wider">
                    Database
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    PostgreSQL
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    MongoDB
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    Redis
                  </div>
                </div>
              </div>

              {/* DevOps */}
              <div className="text-center">
                <div className="mb-3">
                  <span className="font-body text-sm text-accent-dark font-bold uppercase tracking-wider">
                    DevOps
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    AWS / Azure
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    Docker
                  </div>
                  <div className="px-4 py-2 bg-accent/10 border-2 border-ink font-mono text-sm">
                    CI/CD
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t-2 border-ink">
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-accent-dark mb-1">
                  6+
                </div>
                <div className="font-body text-sm text-ink/70">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-accent-dark mb-1">
                  15+
                </div>
                <div className="font-body text-sm text-ink/70">
                  Projects Delivered
                </div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-accent-dark mb-1">
                  5
                </div>
                <div className="font-body text-sm text-ink/70">
                  Team Members Led
                </div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-accent-dark mb-1">
                  99%
                </div>
                <div className="font-body text-sm text-ink/70">
                  Client Satisfaction
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDown size={32} className="text-accent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};