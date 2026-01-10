import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '@/core/routes';

const navItems = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Projects', path: ROUTES.PROJECTS },
  { label: 'Blog', path: ROUTES.BLOG },
  { label: 'Contact', path: ROUTES.CONTACT },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b-2 border-ink">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to={ROUTES.HOME} className="font-display text-2xl font-bold text-ink">
            Portfolio
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-body text-lg transition-colors relative group ${
                  location.pathname === item.path
                    ? 'text-accent'
                    : 'text-ink hover:text-accent'
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-ink"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 font-body text-lg ${
                  location.pathname === item.path
                    ? 'text-accent'
                    : 'text-ink hover:text-accent'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
};
