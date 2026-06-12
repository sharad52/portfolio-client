import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, MessageCircle, CheckCircle2, Loader2, CalendarClock } from 'lucide-react';
import {
  submitContact, whatsAppFromForm, buildWhatsAppLink, buildMeetingLink, isFormConfigured,
} from '@/features/contact/services/contactService';
import type { ContactFormData } from '@/features/contact/types';
import { profile, socials, seo } from '@/content/site';
import { AuroraBackground, Icon, MagneticButton, Reveal, Section } from '@/shared/components/ui';

const EMPTY: ContactFormData = { name: '', email: '', subject: '', message: '', phone: '' };

const CONTACT_TITLE = 'Contact Sharad Bhandari — Hire a Senior Software Engineer in Nepal';
const CONTACT_DESC =
  'Contact Sharad Bhandari, a senior software engineer and Python developer based in Kathmandu, Nepal. Available to hire for senior, freelance and contract roles — remote worldwide.';

/** ContactPage structured data — signals hiring/contact intent for this page. */
const contactPageLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: CONTACT_TITLE,
  url: `${seo.siteUrl}/contact`,
  mainEntity: {
    '@type': 'Person',
    '@id': `${seo.siteUrl}/#sharad-bhandari`,
    name: 'Sharad Bhandari',
    jobTitle: 'Senior Software Engineer',
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Hiring & project enquiries',
      email: profile.email,
      telephone: profile.phone,
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Nepali'],
    },
  },
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    // If no email/sheet delivery is configured, route straight to WhatsApp.
    if (!isFormConfigured()) {
      window.open(whatsAppFromForm(form), '_blank', 'noopener');
      setStatus('sent');
      setForm(EMPTY);
      return;
    }

    const result = await submitContact(form);
    if (result.ok) {
      setStatus('sent');
      setForm(EMPTY);
    } else {
      setStatus('error');
      setError(result.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{CONTACT_TITLE}</title>
        <meta name="description" content={CONTACT_DESC} />
        <link rel="canonical" href={`${seo.siteUrl}/contact`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sharad Bhandari" />
        <meta property="og:title" content={CONTACT_TITLE} />
        <meta property="og:description" content={CONTACT_DESC} />
        <meta property="og:url" content={`${seo.siteUrl}/contact`} />
        <meta property="og:image" content={seo.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={CONTACT_TITLE} />
        <meta name="twitter:description" content={CONTACT_DESC} />
        <meta name="twitter:image" content={seo.ogImage} />

        <script type="application/ld+json">{JSON.stringify(contactPageLd)}</script>
      </Helmet>

      <div className="relative pt-32">
        <AuroraBackground />
        <Section className="pt-0">
          <div className="mb-14 max-w-2xl">
            <Reveal>
              <span className="chip mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {profile.availability}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-4xl font-medium tracking-tight text-fg md:text-5xl">
                Let's <span className="gradient-text">connect</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg text-fg-muted">
                Available to hire as a <strong className="text-fg">senior software engineer and Python developer in Nepal</strong> —
                for full-time, freelance and contract roles, remote worldwide.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-3 text-fg-muted">
                The fastest way to reach me is WhatsApp. Prefer email? Drop a message below — it lands straight in my inbox.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left — info + WhatsApp */}
            <Reveal>
              <div className="flex h-full flex-col gap-8 rounded-3xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-fg">Reach me directly</h2>
                  <p className="mt-2 text-sm text-fg-muted">
                    I usually reply within a day. For anything time-sensitive, WhatsApp is best.
                  </p>
                </div>

                <div className="space-y-3">
                  <MagneticButton className="w-full">
                    <a
                      href={buildWhatsAppLink(`Hi Sharad, I came across your portfolio and would like to connect.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full"
                      style={{ backgroundImage: 'linear-gradient(110deg,#3f7d68,#4f9a7e 55%,#88adb5)' }}
                    >
                      <MessageCircle size={18} /> Message me on WhatsApp
                    </a>
                  </MagneticButton>

                  <MagneticButton className="w-full">
                    <a
                      href={buildMeetingLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost w-full"
                    >
                      <CalendarClock size={18} /> Schedule a meeting
                    </a>
                  </MagneticButton>
                  <p className="text-center text-xs text-fg-faint">
                    Books a slot on my Google Calendar — pick a time that suits you.
                  </p>
                </div>

                <div className="space-y-5">
                  <a href={`mailto:${profile.email}`} className="group flex min-w-0 items-start gap-4">
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04] text-accent-cyan">
                      <Mail size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-fg-faint">Email</span>
                      <span className="block break-all text-fg transition-colors group-hover:text-accent-cyan">{profile.email}</span>
                    </span>
                  </a>
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04] text-accent-cyan">
                      <Phone size={18} />
                    </span>
                    <span>
                      <span className="block text-xs text-fg-faint">Phone / WhatsApp</span>
                      <span className="text-fg">{profile.phone}</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04] text-accent-cyan">
                      <MapPin size={18} />
                    </span>
                    <span>
                      <span className="block text-xs text-fg-faint">Location</span>
                      <span className="text-fg">{profile.location}</span>
                      <span className="block text-xs text-fg-muted">Open to remote worldwide</span>
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3 border-t border-line pt-6">
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
            </Reveal>

            {/* Right — form */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
                {status === 'sent' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-dark text-fg">
                      <CheckCircle2 size={32} />
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-fg">Message on its way</h3>
                    <p className="mt-2 max-w-sm text-fg-muted">
                      Thanks for reaching out — I'll get back to you shortly.
                    </p>
                    <button onClick={() => setStatus('idle')} className="btn-ghost mt-6 text-sm">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Name" name="name" value={form.name} onChange={onChange} required placeholder="Jane Doe" />
                      <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="jane@company.com" />
                    </div>
                    <Field label="Subject" name="subject" value={form.subject || ''} onChange={onChange} placeholder="Role · Project · Collaboration" />
                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm text-fg-muted">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={form.message}
                        onChange={onChange}
                        placeholder="Tell me a little about what you have in mind…"
                        className="w-full resize-none rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>

                    {status === 'error' && error && (
                      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}{' '}
                        <a href={whatsAppFromForm(form)} target="_blank" rel="noopener noreferrer" className="underline">
                          Send via WhatsApp instead
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-60">
                        {status === 'sending' ? (
                          <><Loader2 size={18} className="animate-spin" /> Sending…</>
                        ) : (
                          <>Send message <Send size={18} /></>
                        )}
                      </button>
                      <a
                        href={whatsAppFromForm(form)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-sm"
                      >
                        <MessageCircle size={16} /> Or WhatsApp
                      </a>
                    </div>
                    <p className="text-xs text-fg-faint">
                      * Required. Your message is emailed directly to me — nothing is stored on this site.
                      Your approximate location (city-level, from your IP) is included to help me respond.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </Section>
      </div>
    </>
  );
};

/* Small labelled input */
const Field: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}> = ({ label, name, value, onChange, type = 'text', required, placeholder }) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-sm text-fg-muted">
      {label}{required && ' *'}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
    />
  </div>
);
