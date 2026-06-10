import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import type { Experience } from '@/content/site';

export const ExperienceTimeline: React.FC<{ items: Experience[] }> = ({ items }) => (
  <div className="relative">
    {/* vertical line */}
    <div className="absolute left-[14px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/40 via-line to-transparent md:left-[18px]" />

    <div className="space-y-10">
      {items.map((exp, i) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="relative pl-12 md:pl-16"
        >
          {/* node */}
          <span
            className={`absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border border-line md:h-9 md:w-9 ${
              exp.current ? 'bg-gradient-to-br from-accent to-accent-cyan text-white shadow-glow' : 'bg-white/[0.05] text-fg-muted'
            }`}
          >
            <Briefcase size={15} />
          </span>

          <div className="rounded-2xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-white/20 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-fg md:text-2xl">{exp.position}</h3>
                {exp.companyUrl ? (
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-accent-cyan transition-colors hover:text-fg">
                    {exp.company}
                  </a>
                ) : (
                  <span className="text-accent-cyan">{exp.company}</span>
                )}
              </div>
              {exp.current && (
                <span className="chip text-accent-cyan">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Current
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-5 text-sm text-fg-faint">
              <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> {exp.period}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {exp.location}</span>
            </div>

            {exp.product && (
              <p className="mt-3 font-mono text-xs text-fg-faint">{exp.product}</p>
            )}

            <p className="mt-4 text-sm leading-relaxed text-fg-muted">{exp.description}</p>

            <ul className="mt-4 space-y-2">
              {exp.achievements.map((a, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-fg-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {exp.technologies.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-fg-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
