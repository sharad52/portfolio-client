import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '@/content/site';

/**
 * Brand — the initials tile + wordmark used in the header and footer.
 * Single source of truth so the two can't drift. Neutral steel tile
 * (label off pure-white) to stay within the reference palette.
 */
export const Brand: React.FC<{
  /** Hide the wordmark below the `sm` breakpoint (used in the header). */
  hideNameOnMobile?: boolean;
  className?: string;
}> = ({ hideNameOnMobile = false, className = '' }) => (
  <Link to="/" className={`group flex items-center gap-3 ${className}`}>
    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-accent to-accent-dark font-display text-sm font-bold text-fg shadow-glow">
      {profile.initials}
    </span>
    <span
      className={`font-display text-base font-semibold tracking-tight text-fg ${
        hideNameOnMobile ? 'hidden sm:block' : ''
      }`}
    >
      {profile.name}
    </span>
  </Link>
);
