/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth
 * ─────────────────────────────────────────────────────────────────────────
 *  Edit everything that visitors read from THIS file. No JSX hunting.
 *  Content below is sourced from Sharad's CV (June 2026).
 * ─────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Sharad Bhandari',
  firstName: 'Sharad',
  initials: 'SB',
  role: 'Senior Software Engineer',
  subtitle: 'Backend Systems & API Architecture',
  // Short rotating words used in the hero
  roles: ['Senior Software Engineer', 'Backend Systems Engineer', 'API Architect', 'Async Systems Builder'],
  yearsExperience: 7,
  // One-line positioning statement
  tagline:
    'I build scalable, cloud-ready backend systems — async architectures, clean APIs, and integrations that move real revenue.',
  // 2–3 sentence summary
  summary:
    'Senior backend engineer with 7+ years building scalable, cloud-ready systems in Python. Strong in asynchronous architectures, API design, and data-intensive platforms — currently working on AI-driven systems.',
  // Longer bio for the About section
  bio: [
    'I’m a senior software engineer based in Kathmandu with 7+ years building scalable, cloud-ready backend systems in Python. I specialise in asynchronous architectures, API design, and the data-intensive platforms that sit underneath modern products — and I’m currently focused on AI-driven systems.',
    'I’ve led cross-functional teams of up to 14 engineers, delivered 45+ integrations generating $40–50K/month in recurring revenue, and driven projects end-to-end from planning to production. I care about the parts users never see: clean service boundaries, observability, and CI/CD that lets a team ship fast without breaking things.',
  ],
  location: 'Kathmandu, Nepal',
  availability: 'Open to senior & freelance opportunities',
  email: 'ersharadbhandari@gmail.com',
  phone: '+977 98478 95491',
  // WhatsApp number, DIGITS ONLY (country code + number)
  whatsapp: '9779847895491',
  // Drop a resume PDF in /public and point here, e.g. '/Sharad-Bhandari-CV.pdf'
  resumeUrl: '',
} as const;

export const socials = [
  { label: 'GitHub', href: 'https://github.com/sharad52', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sharad52', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/sharad.bee', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/er.sawrad', icon: 'facebook' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
] as const;

export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Work', path: '/projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Writing', path: '/blog' },
  { label: 'Contact', path: '/contact' },
] as const;

/** Headline stats — all sourced from the CV. */
export const stats = [
  { value: 7, suffix: '+', label: 'Years of experience' },
  { value: 14, suffix: '', label: 'Engineers led' },
  { value: 45, suffix: '+', label: 'Integrations delivered' },
  { value: 99.9, suffix: '%', label: 'Production uptime' },
] as const;

/** Punchy, real career wins — shown as a strip in About. */
export const highlights = [
  '$40–50K / month recurring revenue from 45+ CRM & helpdesk integrations',
  'Led a 14-engineer team — improved integration throughput by 60%',
  'Cut API latency by 65% with async FastAPI · Arq · Redis architecture',
  'Reduced release cycle time by 70% with Dockerized CI/CD pipelines',
  'Maintained 99.9% uptime across multi-tenant integration systems',
] as const;

/** Areas of expertise — shown as cards on Home. icon = lucide name. */
export const expertise = [
  {
    icon: 'server',
    title: 'Backend & API Architecture',
    description:
      'Designing well-bounded services and APIs — REST, GraphQL, gRPC, webhooks — with FastAPI and Django that scale cleanly.',
  },
  {
    icon: 'zap',
    title: 'Async & High-Performance Systems',
    description:
      'Asynchronous architectures with Arq, Redis, and caching that cut latency and handle data-intensive workloads.',
  },
  {
    icon: 'workflow',
    title: 'Integrations at Scale',
    description:
      'Integration frameworks across CRM/COP and automation ecosystems — HubSpot, Salesforce, Twilio, Make, Zapier.',
  },
  {
    icon: 'users',
    title: 'Technical Leadership',
    description:
      'Leading cross-functional teams of up to 14, driving Agile delivery, and mentoring engineers toward high standards.',
  },
] as const;

/** Skills grouped by category. */
export const skillGroups = [
  { category: 'Languages', items: ['Python', 'JavaScript', 'SQL', 'GraphQL', 'C/C++'] },
  { category: 'FrameWorks', items: ['FastAPI', 'Starlette', 'React', 'Django', 'DRF', 'KnockOut', 'Arq'] },
  { category: 'Data & ORM', items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLAlchemy', 'Alembic'] },
  { category: 'APIs & Protocols', items: ['REST', 'GraphQL', 'gRPC', 'Webhooks'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD'] },
  { category: 'Observability & Tooling', items: ['Datadog', 'Grafana', 'Pytest', 'Twilio', 'Make'] },
] as const;

/** Tech labels for the scrolling marquee. */
export const techMarquee = [
  'Python', 'FastAPI', 'Django', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes',
  'GraphQL', 'gRPC', 'Arq', 'SQLAlchemy', 'Twilio', 'GitHub Actions',
] as const;

export type Experience = {
  id: string;
  company: string;
  position: string;
  product?: string;
  location: string;
  period: string;
  current?: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  companyUrl?: string;
};

export const experiences: Experience[] = [
  {
    id: 'maitri',
    company: 'Maitri Services',
    position: 'Senior Software Engineer',
    location: 'Kathmandu, Nepal',
    period: 'May 2026 — Present',
    current: true,
    description:
      'Senior software engineer driving backend architecture and delivery — currently building the ECLAT Encounter Summit platform.',
    achievements: [
      'Building the ECLAT Encounter Summit project end-to-end as a senior engineer.',
      'Designing and delivering scalable backend services and APIs.',
      'Setting architectural standards and mentoring engineers across the team.',
    ],
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    id: 'braintip',
    company: 'BrainTip Pty. Ltd.',
    position: 'Senior Backend Engineer',
    product: 'Dalfin AI — AI-powered software application builder',
    location: 'Australia (Remote)',
    period: 'Dec 2025 — May 2026',
    description:
      'Senior backend engineer on Dalfin AI, an AI-powered software application builder.',
    achievements: [
      'Architected, built, and deployed an end-to-end Order Forecasting System for S&R Philippines, supporting order management and demand planning.',
      'Led and coordinated a cross-functional team of 10 engineers across Backend, AI/ML, and Frontend.',
      'Drove Agile Scrum practices — sprint planning, backlog grooming, delivery — while mentoring engineers and upholding high code and architectural standards.',
    ],
    technologies: ['Python', 'FastAPI', 'AI / ML', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'krispcall',
    company: 'KrispCall Pte. Ltd.',
    position: 'Lead Integration Engineer',
    product: 'KrispCall — AI-driven cloud telephony for modern business',
    location: 'Singapore (Remote)',
    period: 'Apr 2023 — Dec 2025',
    description:
      'Led the integration platform for an AI-driven cloud telephony product serving businesses worldwide.',
    achievements: [
      'Architected and deployed integration frameworks connecting CRM, Customer Operational Platforms, and automation ecosystems (Keap, Make, Zapier, and more).',
      'Re-architected and re-scaled the existing power dialer and extended it with spam detection.',
      'Rebuilt the reporting system with an optimised analytics module — faster insights and far better handling of massive datasets.',
      'Mentored and managed 14 engineers, ensuring high code quality and agile delivery.',
      'Implemented async processing, caching, and error recovery with Redis and Arq; oversaw Docker-based deployments and GitHub Actions CI/CD.',
    ],
    technologies: ['Python', 'FastAPI', 'Arq', 'Redis', 'Twilio', 'Docker', 'GitHub Actions'],
    companyUrl: 'https://krispcall.com',
  },
  {
    id: 'divya',
    company: 'Divya Technology Pvt. Ltd.',
    position: 'Software Engineer',
    product: 'ACCMENT — cloud ERP platform',
    location: 'Kathmandu, Nepal',
    period: 'Aug 2021 — Apr 2023',
    description:
      'Built and scaled the backend for ACCMENT, a SaaS cloud ERP platform.',
    achievements: [
      'Developed REST APIs for the SaaS ERP platform using Django and PostgreSQL.',
      'Integrated IRD compliance, bank reconciliation, and accounting modules.',
      'Managed containerised deployments and API scalability.',
    ],
    technologies: ['Django', 'DRF', 'PostgreSQL', 'Docker'],
    companyUrl: 'https://www.accment.com',
  },
  {
    id: 'codenix',
    company: 'Codenix Engineering Pvt. Ltd.',
    position: 'Software Engineer',
    location: 'Kathmandu, Nepal',
    period: 'Oct 2020 — Aug 2021',
    description:
      'Built web applications and management systems for co-operatives and content platforms.',
    achievements: [
      'Built multi-user co-operative management systems and CMS web applications using Django.',
      'Developed APIs, custom admin modules, and dynamic content systems.',
    ],
    technologies: ['Django', 'Python', 'PostgreSQL'],
  },
];

export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  category: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  accent?: 'violet' | 'cyan' | 'fuchsia';
};

/** Selected work — products Sharad architected / led, drawn from the CV. */
export const projects: Project[] = [
  {
    id: 'order-forecasting',
    title: 'Order Forecasting System',
    tagline: 'Demand planning for S&R Philippines',
    description:
      'An end-to-end order forecasting system supporting order management and demand planning — architected, built, and deployed from the ground up at BrainTip (Dalfin AI).',
    year: '2025',
    category: 'AI / Forecasting',
    technologies: ['Python', 'FastAPI', 'AI / ML', 'PostgreSQL'],
    featured: true,
    accent: 'violet',
  },
  {
  id: 'kharchalog',
  title: 'KharchaLog — Personal Finance Manager',
  tagline: 'Track, plan, and grow your money — all in one place',
  description: 'An AI-powered personal finance platform that tracks income and expenses, manages scheduled payments and loans, and delivers smart reports with investment forecasting — giving you a complete picture of your financial health.',
  year: '2026',
  category: 'Fintech / AI',
  technologies: ['Python', 'JavaScript', 'AI/ML', 'PostgreSQL', 'AWS'],
  featured: true,
  accent: 'cyan'
},
  {
    id: 'krispcall',
    title: 'KrispCall',
    tagline: 'AI-driven cloud telephony for modern business',
    description:
      'Led the integration platform — CRM/automation frameworks, a re-architected power dialer with spam detection, and an analytics module handling massive communication datasets.',
    year: '2023',
    category: 'Cloud Telephony',
    technologies: ['FastAPI', 'Arq', 'Redis', 'Twilio', 'Docker'],
    liveUrl: 'https://krispcall.com',
    featured: true,
    accent: 'cyan',
  },
  {
    id: 'dalfin-ai',
    title: 'Dalfin AI',
    tagline: 'AI-powered software application builder',
    description:
      'A platform that lets teams build software applications with AI. I work on its backend architecture and core services as a senior backend engineer.',
    year: '2025',
    category: 'AI Platform',
    technologies: ['Python', 'FastAPI', 'AI / ML'],
    featured: true,
    accent: 'fuchsia',
  },
  {
    id: 'accment',
    title: 'ACCMENT',
    tagline: 'Cloud ERP platform for accounting & compliance',
    description:
      'A SaaS cloud ERP platform. Built its REST APIs with Django and PostgreSQL, and integrated IRD compliance, bank reconciliation, and accounting modules.',
    year: '2022',
    category: 'Cloud ERP',
    technologies: ['Django', 'DRF', 'PostgreSQL', 'Docker'],
    liveUrl: 'https://www.accment.com',
    accent: 'violet',
  },
];

export const education = [
  {
    degree: 'B.E. Electronics & Communication Engineering',
    institution: 'IOE, Thapathali Campus',
    period: '2014 — 2018',
  },
  {
    degree: '+2 Science',
    institution: 'Gorkha International Public Secondary School, Dang',
    period: '',
  },
];

export const interests = [
  'President, ECAST Thapathali — led tech expos, training & innovation events',
  'Research interests: AI, data-intensive applications, cloud-native design',
  'College cricket team captain — intra-college champions',
] as const;

export const seo = {
  siteUrl: 'https://sharadbhandari.com.np',
  defaultTitle: `${profile.name} — ${profile.role} | Developer in Nepal`,
  defaultDescription:
    'Sharad Bhandari — Senior Software Engineer & backend developer in Kathmandu, Nepal. 7+ years building scalable, cloud-ready systems and async APIs.',
  ogImage: 'https://sharadbhandari.com.np/images/profile.jpeg',
} as const;
