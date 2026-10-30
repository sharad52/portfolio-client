import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, CalendarClock } from 'lucide-react';
import { navItems, type NavItem } from '@/content/site';
import { Icon } from '@/shared/components/ui';
import { buildMeetingLink } from '@/features/contact/services/contactService';
import { Brand } from './Brand';

/** Gradients for highlighted nav pills — emerald→teal ("Learn Python with Me"),
 *  amber→gold (Marketplace, matching the BeReach coin). */
const HIGHLIGHT_GRADIENT: Record<NonNullable<NavItem['highlight']>, string> = {
  emerald: 'linear-gradient(110deg,#3f7d68,#4f9a7e 55%,#88adb5)',
  gold: 'linear-gradient(110deg,#8a5a12,#b07a1c 55%,#c9a24a)',
};

/** Small pulsing tag pinned to a highlighted pill, e.g. "New". */
const NavBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="absolute -right-1.5 -top-2 inline-flex items-center gap-1 rounded-full border border-white/30 bg-base px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-amber-200">
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
    </span>
    {label}
  </span>
);

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
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item, i) => {
            const active = pathname === item.path;

            // Highlighted item — renders as an attention-grabbing gradient pill
            // with a gentle "breathing" glow, so the eye lands on it. Each pill
            // is phase-shifted so neighbouring highlights pulse in turn.
            if (item.highlight) {
              return (
                <motion.div
                  key={item.path}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: (i % 2) * 1.3 }}
                  className="relative mx-1"
                >
                  <Link
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5 ${
                      active ? 'ring-2 ring-white/40' : ''
                    }`}
                    style={{ backgroundImage: HIGHLIGHT_GRADIENT[item.highlight] }}
                  >
                    {item.icon && <Icon name={item.icon} size={15} />}
                    {item.label}
                  </Link>
                  {item.badge && <NavBadge label={item.badge} />}
                </motion.div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors xl:px-4 ${
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
          <a
            href={buildMeetingLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden whitespace-nowrap text-sm lg:inline-flex"
          >
            <CalendarClock size={16} /> Book a call
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/[0.03] text-fg lg:hidden"
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
            className="glass-strong mx-3 mt-2 overflow-hidden rounded-3xl p-3 lg:hidden"
          >
            {navItems.map((item) =>
              item.highlight ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className="my-1 flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-medium text-white shadow-glow"
                  style={{ backgroundImage: HIGHLIGHT_GRADIENT[item.highlight] }}
                >
                  {item.icon && <Icon name={item.icon} size={18} />}
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto rounded-full border border-white/30 bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block rounded-2xl px-4 py-3 text-base transition-colors ${
                    pathname === item.path ? 'bg-white/[0.06] text-fg' : 'text-fg-muted hover:bg-white/[0.04] hover:text-fg'
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <a
              href={buildMeetingLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2 w-full"
            >
              <CalendarClock size={18} /> Book a call
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
