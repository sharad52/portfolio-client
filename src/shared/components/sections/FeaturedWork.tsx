import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/content/site';
import { Reveal, Section, SectionHeading } from '@/shared/components/ui';
import { ProjectCard } from '@/features/projects/components/ProjectCard';

export const FeaturedWork: React.FC = () => {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  return (
    <Section id="work">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Selected work"
          title={<>Things I've <span className="gradient-text">built</span></>}
        />
        <Reveal>
          <Link to="/projects" className="btn-ghost group text-sm">
            All projects
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
};
