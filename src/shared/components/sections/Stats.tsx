import React from 'react';
import { stats } from '@/content/site';
import { CountUp, Reveal, Section } from '@/shared/components/ui';

export const Stats: React.FC = () => (
  <Section className="py-12 md:py-16">
    <div className="grid grid-cols-2 gap-4 rounded-3xl border border-line bg-white/[0.03] p-8 backdrop-blur-xl md:grid-cols-4 md:p-10">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="text-center">
          <div className="font-display text-4xl font-semibold text-fg md:text-5xl">
            <span className="gradient-text">
              <CountUp value={s.value} suffix={s.suffix} />
            </span>
          </div>
          <p className="mt-2 text-sm text-fg-muted">{s.label}</p>
        </Reveal>
      ))}
    </div>
  </Section>
);
