import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '@/shared/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-cream py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-body">
              © {new Date().getFullYear()} Personal Portfolio. All rights reserved.
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href={SOCIAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href={SOCIAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={SOCIAL_LINKS.TWITTER}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              <Twitter size={24} />
            </a>
            <a
              href={SOCIAL_LINKS.EMAIL}
              className="hover:text-accent transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
