import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, GraduationCap, Trophy } from 'lucide-react';
import { education, experiences, interests, profile, stats } from '@/content/site';
import { AuroraBackground, CountUp, MagneticButton, Reveal, Section, SectionHeading } from '@/shared/components/ui';
import { ExperienceTimeline } from '@/features/experience/components/ExperienceTimeline';

export const ExperiencePage: React.FC = () => (
  <>
    <Helmet>
      <title>Experience — Sharad Bhandari</title>
      <meta name="description" content="Professional experience and career journey of Sharad Bhandari, Senior Software Engineer." />
      <link rel="canonical" href="https://sharadbhandari.com.np/experience" />
    </Helmet>

    <div className="relative pt-32">
      <AuroraBackground />
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Career"
          title={<>Professional <span className="gradient-text">experience</span></>}
          intro={`${profile.yearsExperience}+ years building and leading the delivery of production systems across backend, cloud, and frontend.`}
        />

        {profile.resumeUrl && (
          <Reveal>
            <MagneticButton>
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mb-12 text-sm">
                <Download size={16} /> Download résumé
              </a>
            </MagneticButton>
          </Reveal>
        )}

        <div className="mt-4">
          <ExperienceTimeline items={experiences} />
        </div>

        {/* Education + Interests */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-line bg-white/[0.03] p-7 backdrop-blur-xl">
              <h3 className="mb-5 inline-flex items-center gap-2 font-display text-xl font-semibold text-fg">
                <GraduationCap size={20} className="text-accent-cyan" /> Education
              </h3>
              <ul className="space-y-5">
                {education.map((e) => (
                  <li key={e.degree}>
                    <p className="font-medium text-fg">{e.degree}</p>
                    <p className="text-sm text-fg-muted">{e.institution}</p>
                    {e.period && <p className="mt-0.5 font-mono text-xs text-fg-faint">{e.period}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-line bg-white/[0.03] p-7 backdrop-blur-xl">
              <h3 className="mb-5 inline-flex items-center gap-2 font-display text-xl font-semibold text-fg">
                <Trophy size={20} className="text-accent-cyan" /> Leadership & Interests
              </h3>
              <ul className="space-y-3">
                {interests.map((it) => (
                  <li key={it} className="flex gap-3 text-sm text-fg-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Stat band */}
        <div className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-line bg-white/[0.03] p-8 backdrop-blur-xl md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="font-display text-3xl font-semibold md:text-4xl">
                <span className="gradient-text"><CountUp value={s.value} suffix={s.suffix} /></span>
              </div>
              <p className="mt-1 text-sm text-fg-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl border border-line bg-white/[0.03] p-10 text-center backdrop-blur-xl">
            <h3 className="font-display text-2xl font-semibold text-fg">Interested in working together?</h3>
            <p className="max-w-xl text-fg-muted">I'm open to senior roles, freelance projects, and consulting engagements.</p>
            <MagneticButton>
              <Link to="/contact" className="btn-primary">Get in touch <ArrowRight size={18} /></Link>
            </MagneticButton>
          </div>
        </Reveal>
      </Section>
    </div>
  </>
);
