import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navItems } from '@/content/site';
import { Brand } from './Brand';

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-3 mt-3 flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-300 md:mx-auto md:mt-4 ${
          scrolled ? 'glass-strong shadow-card' : 'border border-transparent'
        }`}
      >
        {/* Brand */}
        <Brand hideNameOnMobile />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  active ? 'text-fg' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line bg-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link to="/contact" className="btn-primary hidden text-sm md:inline-flex">
            Let’s talk
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/[0.03] text-fg md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="glass-strong mx-3 mt-2 overflow-hidden rounded-3xl p-3 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-2xl px-4 py-3 text-base transition-colors ${
                  pathname === item.path ? 'bg-white/[0.06] text-fg' : 'text-fg-muted hover:bg-white/[0.04] hover:text-fg'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary mt-2 w-full">
              Let’s talk
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
