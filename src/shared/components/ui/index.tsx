import React, { useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import {
  Server, Cloud, LayoutGrid, Users, Github, Linkedin, Mail, ArrowRight,
  Zap, Workflow, Database,
  type LucideIcon,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────
 *  Icon resolver — maps a string key (from content) to a Lucide icon
 * ──────────────────────────────────────────────────────────── */
const ICONS: Record<string, LucideIcon> = {
  server: Server,
  cloud: Cloud,
  layout: LayoutGrid,
  users: Users,
  zap: Zap,
  workflow: Workflow,
  database: Database,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export const Icon: React.FC<{ name: string; size?: number; className?: string }> = ({
  name, size = 24, className,
}) => {
  const Cmp = ICONS[name] ?? ArrowRight;
  return <Cmp size={size} className={className} />;
};

/* ────────────────────────────────────────────────────────────
 *  AuroraBackground — animated gradient orbs + dot grid
 * ──────────────────────────────────────────────────────────── */
export const AuroraBackground: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
    {/* Calm, flat slate glow — barely there, no grid, no colour noise */}
    <div className="absolute -top-48 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-aurora opacity-[0.10] blur-[150px] animate-aurora-shift" />
    <div className="absolute bottom-0 left-1/2 h-[26rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent-dark/10 blur-[150px]" />
  </div>
);

/* ────────────────────────────────────────────────────────────
 *  Reveal — scroll-triggered fade + rise
 * ──────────────────────────────────────────────────────────── */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li';
}> = ({ children, delay = 0, y = 24, className, as = 'div' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

/* ────────────────────────────────────────────────────────────
 *  Section — consistent vertical rhythm + max width
 * ──────────────────────────────────────────────────────────── */
export const Section: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => (
  <section id={id} className={`relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28 ${className}`}>
    {children}
  </section>
);

/* ────────────────────────────────────────────────────────────
 *  SectionHeading — eyebrow + title + optional intro
 * ──────────────────────────────────────────────────────────── */
export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: 'left' | 'center';
}> = ({ eyebrow, title, intro, align = 'left' }) => (
  <div className={`mb-14 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}`}>
    {eyebrow && (
      <Reveal>
        <span className="chip mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
          {eyebrow}
        </span>
      </Reveal>
    )}
    <Reveal delay={0.05}>
      <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-fg md:text-5xl">
        {title}
      </h2>
    </Reveal>
    {intro && (
      <Reveal delay={0.1}>
        <p className={`mt-5 text-lg leading-relaxed text-fg-muted ${align === 'center' ? 'mx-auto' : ''}`}>
          {intro}
        </p>
      </Reveal>
    )}
  </div>
);

/* ────────────────────────────────────────────────────────────
 *  MagneticButton — cursor-following spring wrapper
 * ──────────────────────────────────────────────────────────── */
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className, strength = 0.35 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
};

/* ────────────────────────────────────────────────────────────
 *  Marquee — infinite horizontal scroll of items
 * ──────────────────────────────────────────────────────────── */
export const Marquee: React.FC<{ items: readonly string[] }> = ({ items }) => (
  <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
    <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
      {[...items, ...items].map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="chip whitespace-nowrap px-4 py-2 text-sm text-fg"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────
 *  ScrollProgress — gradient bar pinned to the top
 * ──────────────────────────────────────────────────────────── */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-accent-indigo to-accent-cyan"
    />
  );
};

/* ────────────────────────────────────────────────────────────
 *  CountUp — animates a number into view
 * ──────────────────────────────────────────────────────────── */
export const CountUp: React.FC<{ value: number; suffix?: string; decimals?: number }> = ({
  value, suffix = '', decimals,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const dp = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const rounded = useTransform(mv, (v) => `${v.toFixed(dp)}${suffix}`);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animateValue(mv, value);
    return controls;
  }, [inView, value, mv]);

  return <motion.span ref={ref}>{inView ? <motion.span>{rounded}</motion.span> : `0${suffix}`}</motion.span>;
};

/* tiny tween helper (avoids Date.now / extra deps) */
function animateValue(mv: MotionValue<number>, to: number) {
  const duration = 1400;
  let raf = 0;
  let start: number | null = null;
  const step = (ts: number) => {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    mv.set(to * eased);
    if (p < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
