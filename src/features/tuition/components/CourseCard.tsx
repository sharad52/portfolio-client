import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CalendarDays, Check, ArrowRight } from 'lucide-react';
import { Icon } from '@/shared/components/ui';
import { formatIsoDate } from '@/shared/utils/helpers';
import { intakes } from '@/content/site';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  index?: number;
  onEnroll: (course: Course) => void;
}

const LEVEL_STYLE: Record<Course['level'], string> = {
  Beginner: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  Intermediate: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10',
  Advanced: 'text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10',
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, index = 0, onEnroll }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    className="group relative flex h-full flex-col rounded-3xl border border-line bg-white/[0.03] p-7 backdrop-blur-xl transition-colors hover:border-white/20"
  >
    <div className="absolute right-6 top-6 flex flex-col items-end gap-2">
      {course.runningNow && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Running now
        </span>
      )}
      {course.popular && (
        <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-medium text-fg">
          Most popular
        </span>
      )}
    </div>

    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-white/[0.04] text-accent-cyan">
      <Icon name={course.icon} size={22} />
    </span>

    <span className={`mt-5 w-fit rounded-full border px-3 py-1 text-xs font-medium ${LEVEL_STYLE[course.level]}`}>
      {course.level}
    </span>

    <h3 className="mt-4 font-display text-xl font-semibold text-fg">{course.title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{course.summary}</p>

    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-fg-faint">
      <span className="inline-flex items-center gap-1.5"><Clock size={14} />{course.duration}</span>
      <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{course.sessionsPerWeek}× / week</span>
    </div>

    <div className="mt-4 rounded-2xl border border-line bg-white/[0.02] px-3.5 py-3 text-xs">
      <p className="text-fg"><span className="text-fg-faint">Days:</span> {course.days}</p>
      <p className="mt-1 text-fg"><span className="text-fg-faint">Time:</span> Morning 7–8 AM or Evening 7–8 PM</p>

      <div className="mt-3 space-y-1.5 border-t border-line pt-3">
        {course.runningNow && (
          <p className="flex items-center gap-1.5 text-emerald-200">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
            {intakes.current.label} batch in progress
          </p>
        )}
        <p className="text-fg">
          <span className="text-fg-faint">Enrolling for:</span>{' '}
          <strong className="font-medium text-accent-cyan">{intakes.next.label}</strong>
          <span className="text-fg-faint"> — starts {formatIsoDate(course.startDate, 'EEE, d MMM')}</span>
        </p>
      </div>
    </div>

    <ul className="mt-5 space-y-2">
      {course.highlights.map((h) => (
        <li key={h} className="flex items-start gap-2 text-sm text-fg-muted">
          <Check size={16} className="mt-0.5 flex-shrink-0 text-accent-cyan" />
          {h}
        </li>
      ))}
    </ul>

    <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-6">
      <div>
        <span className="block text-xs text-fg-faint">Course fee</span>
        <span className="font-display text-lg font-semibold text-fg">{course.price}</span>
      </div>
      <button
        onClick={() => onEnroll(course)}
        className="btn-primary text-sm"
      >
        Enroll for {intakes.next.short} <ArrowRight size={16} />
      </button>
    </div>
  </motion.article>
);
