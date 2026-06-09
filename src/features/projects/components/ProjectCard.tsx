import React from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/content/site';

const ACCENT: Record<NonNullable<Project['accent']>, string> = {
  violet: 'from-accent/25',
  cyan: 'from-accent-cyan/25',
  fuchsia: 'from-accent-fuchsia/25',
};

export const ProjectCard: React.FC<{ project: Project; index?: number }> = ({ project, index = 0 }) => {
  const glow = ACCENT[project.accent ?? 'violet'];
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white/[0.03] p-7 backdrop-blur-xl transition-colors hover:border-white/20"
    >
      {/* hover glow */}
      <div className={`pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br ${glow} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

      <div className="mb-6 flex items-center justify-between">
        <span className="chip">{project.category}</span>
        <span className="font-mono text-xs text-fg-faint">{project.year}</span>
      </div>

      <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">
        {project.title}
      </h3>
      <p className="mt-1 text-sm font-medium text-accent-cyan">{project.tagline}</p>

      <p className="mt-4 flex-grow text-sm leading-relaxed text-fg-muted">
        {project.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-fg-muted">
            {t}
          </span>
        ))}
      </div>

      {(project.githubUrl || project.liveUrl) && (
        <div className="mt-6 flex items-center gap-5 border-t border-line pt-5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <Github size={16} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              Live
              <ArrowUpRight size={15} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
};
