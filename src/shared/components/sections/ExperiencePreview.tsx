import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { experiences } from '@/content/site';
import { Reveal, Section, SectionHeading } from '@/shared/components/ui';
import { ExperienceTimeline } from '@/features/experience/components/ExperienceTimeline';

export const ExperiencePreview: React.FC = () => (
  <Section id="experience-preview">
    <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
      <SectionHeading
        eyebrow="Journey"
        title={<>Where I've made an <span className="gradient-text">impact</span></>}
      />
      <Reveal>
        <Link to="/experience" className="btn-ghost group text-sm">
          Full timeline
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>

    <ExperienceTimeline items={experiences.slice(0, 2)} />
  </Section>
);
