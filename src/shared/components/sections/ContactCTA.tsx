import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { profile } from '@/content/site';
import { buildWhatsAppLink } from '@/features/contact/services/contactService';
import { MagneticButton, Reveal, Section } from '@/shared/components/ui';

export const ContactCTA: React.FC = () => (
  <Section>
    <Reveal>
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white/[0.03] px-8 py-16 text-center backdrop-blur-xl md:px-16 md:py-20">
        {/* aurora wash */}
        <div className="pointer-events-none absolute -inset-x-20 -top-20 h-72 bg-aurora opacity-25 blur-[100px]" />

        <span className="chip mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {profile.availability}
        </span>
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
          Have something worth <span className="gradient-text">building</span>?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-fg-muted">
          Whether it's a role, a project, or a problem you can't quite untangle — I'd love to hear about it.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <Link to="/contact" className="btn-primary">
              Start a conversation
              <ArrowRight size={18} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a
              href={buildWhatsAppLink('Hi Sharad, I came across your portfolio and would like to connect.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </MagneticButton>
        </div>
      </div>
    </Reveal>
  </Section>
);
