import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, MapPin, Sparkles } from 'lucide-react';
import { profile, socials, techMarquee } from '@/content/site';
import { AuroraBackground, Icon, MagneticButton, Marquee } from '@/shared/components/ui';

/** Rotating role text */
const RoleRotator: React.FC = () => {
  const roles = profile.roles;
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [roles.length]);
  return (
    <span className="relative inline-block align-bottom">
      <motion.span
        key={i}
        initial={{ y: '60%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-60%', opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="gradient-text-animated font-medium"
      >
        {roles[i]}
      </motion.span>
    </span>
  );
};

export const Hero: React.FC = () => {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-12 pt-28">
      <AuroraBackground />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="chip mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl lg:text-7xl"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-4 font-display text-2xl font-medium text-fg md:text-3xl"
          >
            <RoleRotator />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Link to="/projects" className="btn-primary">
                View my work
                <ArrowRight size={18} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/contact" className="btn-ghost">
                Get in touch
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Socials + location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/[0.03] text-fg-muted transition-all hover:-translate-y-0.5 hover:border-white/25 hover:text-fg"
                >
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-fg-muted">
              <MapPin size={16} className="text-accent-cyan" />
              {profile.location}
            </span>
          </motion.div>
        </div>

        {/* Right — glass profile card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[17rem] sm:max-w-[18rem]"
        >
          {/* glow */}
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-aurora opacity-20 blur-3xl" />

          <div className="glass-strong overflow-hidden rounded-[2rem] p-2 shadow-card">
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <img
                src="/images/profile.jpeg"
                alt={profile.name}
                className="aspect-[4/5] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* gradient veil */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl border border-line bg-base/50 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="font-display text-sm font-semibold text-fg">{profile.firstName}</p>
                  <p className="text-xs text-fg-muted">{profile.role}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] text-accent-cyan">
                  <Sparkles size={12} />
                  {profile.yearsExperience}+ yrs
                </span>
              </div>
            </div>
          </div>

          {/* floating accent card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="glass absolute -right-4 -top-4 rounded-2xl px-4 py-3 shadow-glow"
          >
            <p className="font-mono text-[11px] text-fg-muted">building</p>
            <p className="font-display text-sm font-semibold text-fg">scalable systems</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Tech marquee + scroll cue — in normal flow so nothing overlaps */}
      <div className="mx-auto mt-16 w-full max-w-6xl px-6">
        <Marquee items={techMarquee} />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="mt-6 flex justify-center text-fg-faint"
        >
          <ArrowDown size={18} />
        </motion.div>
      </div>
    </section>
  );
};
