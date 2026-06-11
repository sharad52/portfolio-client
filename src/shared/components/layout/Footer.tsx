import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { navItems, profile, socials } from '@/content/site';
import { Icon } from '@/shared/components/ui';
import { Brand } from './Brand';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + pitch */}
          <div>
            <Brand />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
              {profile.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/[0.03] text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
                >
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-faint">Navigate</h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-faint">Get in touch</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-1 text-fg-muted transition-colors hover:text-fg">
                  {profile.email}
                  <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
              <li className="text-fg-muted">{profile.phone}</li>
              <li className="text-fg-muted">{profile.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-fg-faint md:flex-row">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p className="font-mono">Built with React · Tailwind · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
};
