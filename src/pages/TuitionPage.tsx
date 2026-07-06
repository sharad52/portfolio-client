import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Users, Wifi, Video, BadgeCheck, Check } from 'lucide-react';
import { profile, seo, courses, batches } from '@/content/site';
import type { Course } from '@/features/tuition/types';
import { CourseCard } from '@/features/tuition/components/CourseCard';
import { EnrollDialog } from '@/features/tuition/components/EnrollDialog';
import { AuroraBackground, Reveal, Section } from '@/shared/components/ui';

const TITLE = 'Learn Python Online — Python Classes & Coaching in Kathmandu, Nepal';
const DESC =
  'Learn Python online with live, small-group coaching from Sharad Bhandari — a senior software engineer in Kathmandu, Nepal with 7+ years’ experience. Python classes for beginners through to backend development (Django, FastAPI). Enroll free for the next batch — no payment needed.';

/** Search terms this page targets. Google largely ignores the keywords meta,
 *  but it is harmless and the same terms are woven into the title, description,
 *  visible copy and structured data below — which is what actually ranks. */
const KEYWORDS = [
  'Python online coaching',
  'learn Python online',
  'Python classes in Kathmandu',
  'Python tuition in Nepal',
  'Python programming course Nepal',
  'online Python classes Nepal',
  'Python for beginners',
  'learn to code Nepal',
  'Python coaching Kathmandu',
  'Django FastAPI course',
  'Python bootcamp Nepal',
  'coding classes Kathmandu',
  'Python instructor Nepal',
  'live Python classes online',
  'Python training Nepal',
].join(', ');

const PERKS = [
  { icon: Wifi, label: 'Fully online', sub: 'Join live from anywhere' },
  { icon: Users, label: 'Small groups', sub: 'Personal attention' },
  { icon: Video, label: 'Recordings', sub: 'Revisit every session' },
  { icon: CalendarDays, label: 'Fixed batches', sub: 'Clear start dates' },
] as const;

/** The reassurances a hesitant student needs before enrolling. */
const ASSURANCES = [
  'Reserve your seat in under a minute',
  'Beginner-friendly — start from absolute zero',
  'Live, small-group sessions with me',
  'Seat & fees confirmed over WhatsApp first',
] as const;

const FAQ = [
  {
    q: 'Who teaches the Python classes?',
    a: `I'm Sharad Bhandari, a senior software engineer based in Kathmandu, Nepal with ${profile.yearsExperience}+ years building production Python systems. I teach every session personally.`,
  },
  {
    q: 'Are the classes online or in person?',
    a: 'All classes are online and live, in small groups, so you can join from anywhere. Every session is recorded and shared so you can revisit it any time.',
  },
  {
    q: 'Do I need any prior programming experience?',
    a: 'No. The Python for Beginners course starts from zero. If you already know some Python, the Data Structures and Backend Development courses take you further.',
  },
  {
    q: 'Do you offer Python classes in Kathmandu or elsewhere in Nepal?',
    a: 'Yes. I offer live online Python coaching to students across Kathmandu and all of Nepal — and worldwide. Because classes are online, you get the same small-group teaching whether you are in Kathmandu, Pokhara, or abroad, without any commute.',
  },
  {
    q: 'How do I pay after I enroll?',
    a: "Enrolling on this page just reserves your interest — no payment is taken online. I'll contact you over WhatsApp or email to confirm your seat and share payment options.",
  },
] as const;

/** Instructor — reused as the provider on every course. */
const provider = {
  '@type': 'Person',
  name: profile.name,
  url: seo.siteUrl,
  jobTitle: 'Senior Software Engineer & Python Instructor',
  address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
};

/** Course catalogue → schema.org Course list, aids search for "learn Python online". */
const coursesLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Online Python Classes & Coaching — Kathmandu, Nepal',
  itemListElement: courses.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Course',
      name: c.title,
      description: c.summary,
      inLanguage: ['en', 'ne'],
      provider,
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: `${c.duration}, ${c.sessionsPerWeek} sessions per week`,
        location: { '@type': 'VirtualLocation', url: `${seo.siteUrl}/tuition` },
      },
    },
  })),
};

/** Service-style signal that ties "Python coaching" to Kathmandu, Nepal + worldwide online. */
const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Python programming coaching & tuition',
  provider,
  areaServed: [
    { '@type': 'City', name: 'Kathmandu' },
    { '@type': 'Country', name: 'Nepal' },
    'Worldwide (online)',
  ],
  audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  url: `${seo.siteUrl}/tuition`,
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const STATUS_STYLE: Record<(typeof batches)[number]['status'], string> = {
  open: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  filling: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
  closed: 'text-fg-faint border-line bg-white/[0.03]',
};

const STATUS_LABEL: Record<(typeof batches)[number]['status'], string> = {
  open: 'Enrolling now',
  filling: 'Filling fast',
  closed: 'Full',
};

export const TuitionPage: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="keywords" content={KEYWORDS} />
        <link rel="canonical" href={`${seo.siteUrl}/tuition`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sharad Bhandari" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={`${seo.siteUrl}/tuition`} />
        <meta property="og:image" content={seo.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={seo.ogImage} />

        <script type="application/ld+json">{JSON.stringify(coursesLd)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <div className="relative pt-32">
        <AuroraBackground />
        <Section className="pt-0">
          {/* Hero */}
          <div className="mb-14 max-w-2xl">
            <Reveal>
              <span className="chip mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Enrolling for the next batch
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-4xl font-medium tracking-tight text-fg md:text-5xl">
                Learn <span className="gradient-text">Python</span> online, live with me
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg text-fg-muted">
                Hands-on, small-group <strong className="text-fg">online Python coaching</strong> taught by{' '}
                <strong className="text-fg">{profile.name}</strong> — a senior software engineer based in Kathmandu,
                Nepal with {profile.yearsExperience}+ years building real production systems. Join live from anywhere
                in Nepal or worldwide. Start from zero or level up to backend development. Pick a course, choose a
                batch, and enroll in a minute — no payment needed now.
              </p>
            </Reveal>
          </div>

          {/* Reassurance banner — the fundamentals, highlighted */}
          <Reveal delay={0.18}>
            <div className="mb-14 overflow-hidden rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-400/[0.10] via-white/[0.02] to-transparent p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200">
                    <BadgeCheck size={14} /> Free to enroll
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
                    No payment needed to enroll
                  </h2>
                  <p className="mt-2 text-fg-muted">
                    Just pick a course and reserve your seat. I'll personally confirm your seat and
                    share payment options over WhatsApp or email — nothing is ever charged on this site.
                  </p>
                </div>
                <ul className="grid shrink-0 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
                  {ASSURANCES.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-fg">
                      <Check size={16} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Perks */}
          <Reveal delay={0.15}>
            <div className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PERKS.map(({ icon: PerkIcon, label, sub }) => (
                <div key={label} className="rounded-2xl border border-line bg-white/[0.03] p-4 backdrop-blur-xl">
                  <PerkIcon size={20} className="text-accent-cyan" />
                  <p className="mt-3 text-sm font-medium text-fg">{label}</p>
                  <p className="text-xs text-fg-faint">{sub}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Courses */}
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-fg">Choose your course</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard key={course.slug} course={course} index={i} onEnroll={setActiveCourse} />
            ))}
          </div>

          {/* Batches */}
          <Reveal>
            <div className="mt-16 rounded-3xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-fg">Upcoming batches</h2>
              <p className="mt-2 text-sm text-fg-muted">
                Every course runs in these batches. Seats are limited — pick one when you enroll.
              </p>
              <div className="mt-6 space-y-3">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col gap-2 rounded-2xl border border-line bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-fg">{b.label}</p>
                      <p className="text-sm text-fg-muted">{b.schedule}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-fg-faint">{b.seats} seats</span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLE[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* FAQ — crawlable copy that matches the FAQ JSON-LD */}
          <Reveal>
            <div className="mt-16 max-w-3xl border-t border-line pt-10">
              <h2 className="font-display text-2xl font-semibold text-fg">Questions, answered</h2>
              <dl className="mt-8 space-y-6">
                {FAQ.map(({ q, a }) => (
                  <div key={q}>
                    <dt className="font-display text-lg font-medium text-fg">{q}</dt>
                    <dd className="mt-1.5 text-fg-muted">{a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Section>
      </div>

      <EnrollDialog course={activeCourse} onClose={() => setActiveCourse(null)} />
    </>
  );
};

export default TuitionPage;
