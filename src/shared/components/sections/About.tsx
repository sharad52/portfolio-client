import React from 'react';
import { Sparkles } from 'lucide-react';
import { profile, expertise, highlights } from '@/content/site';
import { Icon, Reveal, Section, SectionHeading } from '@/shared/components/ui';

export const About: React.FC = () => (
  <Section id="about">
    <SectionHeading
      eyebrow="About"
      title={<>Engineering that holds up <span className="gradient-text">under pressure</span></>}
    />

    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      {/* Bio + highlights */}
      <div className="space-y-5">
        {profile.bio.map((para, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className="text-lg leading-relaxed text-fg-muted">{para}</p>
          </Reveal>
        ))}

        <Reveal delay={0.16}>
          <ul className="mt-8 space-y-3 rounded-2xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl">
            {highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-fg-muted">
                <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-accent-cyan" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Expertise cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {expertise.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-cyan/20 text-accent-cyan">
                <Icon name={e.icon} size={20} />
              </span>
              <h3 className="font-display text-lg font-semibold text-fg">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{e.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </Section>
);
