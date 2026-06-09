import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { projects } from '@/content/site';
import { AuroraBackground, Section, SectionHeading } from '@/shared/components/ui';
import { ProjectCard } from '@/features/projects/components/ProjectCard';

export const ProjectsPage: React.FC = () => {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <Helmet>
        <title>Work — Sharad Bhandari</title>
        <meta name="description" content="Selected projects and engineering work by Sharad Bhandari." />
      </Helmet>

      <div className="relative pt-32">
        <AuroraBackground />
        <Section className="pt-0">
          <SectionHeading
            eyebrow="Portfolio"
            title={<>Selected <span className="gradient-text">work</span></>}
            intro="A curated set of projects — the problems they solved and the tools behind them."
          />

          {/* Category filter */}
          <div className="mb-12 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active === c
                    ? 'border-accent/40 bg-accent/15 text-accent-cyan'
                    : 'border-line text-fg-muted hover:border-white/25 hover:text-fg'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
};
