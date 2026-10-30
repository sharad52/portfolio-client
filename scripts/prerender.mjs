/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PRERENDER — bake per-route Open Graph / Twitter tags into static HTML.
 * ─────────────────────────────────────────────────────────────────────────
 *  Why: the site is a client-rendered SPA on S3 + CloudFront. Social crawlers
 *  (Facebook, LinkedIn, WhatsApp, X, Slack…) don't run JavaScript, so they only
 *  see the raw HTML at a URL. Without this step every shared link falls back to
 *  the homepage's tags (profile photo + site title). This generates a real
 *  HTML file per blog post, marketplace product and top-level route, each with its own title,
 *  description and (for articles) cover image — so link previews are correct.
 *
 *  Runs after `vite build` (see package.json "build"). It reads dist/index.html
 *  as the template and writes dist/<route>/index.html for each route.
 *
 *  NOTE: CloudFront must serve /blog/<slug> from blog/<slug>/index.html — see
 *  docs/prerender.md for the one-time CloudFront/S3 routing setup.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = join(root, 'dist');

const SITE_URL = 'https://sharadbhandari.com.np';
const FALLBACK_IMAGE = `${SITE_URL}/images/profile.jpeg`;

/* ── small HTML helpers ──────────────────────────────────────────────── */
const escAttr = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const absImage = (path) =>
  !path ? FALLBACK_IMAGE : path.startsWith('http') ? path : `${SITE_URL}${path}`;

/** Clamp a meta description to <=160 chars (search-engine display limit). */
const clampDesc = (s) => {
  const t = String(s ?? '').trim();
  return t.length <= 160 ? t : `${t.slice(0, 157).trimEnd()}…`;
};

/**
 * Static body for crawlers that don't run JS: gives each page a real <h1> and
 * text inside #root. React's createRoot() clears #root on mount, so visitors
 * never see this — only no-JS crawlers (and the split-second before hydration).
 */
const bodyHtml = (h1, intro, extra = '') =>
  `<div class="prerender-fallback">\n      <h1>${escAttr(h1)}</h1>\n      <p>${escAttr(intro)}</p>${extra}\n      </div>`;

const injectBody = (html, body) =>
  html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

/** Replace <title>…</title>. */
const setTitle = (html, title) =>
  html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escAttr(title)}</title>`);

/** Replace the content="" of a <meta> identified by an attr/value pair. No-op if absent. */
function setMeta(html, keyAttr, keyVal, content) {
  const re = new RegExp(`(<meta\\s+${keyAttr}="${escRe(keyVal)}"\\s+content=")[^"]*(")`);
  return html.replace(re, (_m, a, b) => `${a}${escAttr(content)}${b}`);
}

/** Remove a <meta> tag entirely (used for image dims that don't apply to articles). */
function removeMeta(html, keyAttr, keyVal) {
  const re = new RegExp(`\\s*<meta\\s+${keyAttr}="${escRe(keyVal)}"[^>]*>`, 'g');
  return html.replace(re, '');
}

/** Replace <link rel="canonical" href="">. */
const setCanonical = (html, href) =>
  html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, (_m, a, b) => `${a}${escAttr(href)}${b}`);

/* ── core: apply a route's metadata to the template ──────────────────── */
function applyMeta(template, { title, description, keywords, url, image, ogType, articleMeta, body }) {
  let html = template;
  html = setTitle(html, title);
  html = setMeta(html, 'name', 'description', clampDesc(description));
  if (keywords) html = setMeta(html, 'name', 'keywords', keywords);
  html = setCanonical(html, url);

  html = setMeta(html, 'property', 'og:type', ogType);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:secure_url', image);
  html = setMeta(html, 'property', 'og:image:alt', title);

  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = setMeta(html, 'name', 'twitter:image:alt', title);

  // Article / product images aren't the profile portrait — drop the homepage's
  // hardcoded dimensions so platforms don't reject a size mismatch.
  if (ogType === 'article' || ogType === 'product') {
    html = removeMeta(html, 'property', 'og:image:width');
    html = removeMeta(html, 'property', 'og:image:height');
  }

  if (articleMeta) {
    html = html.replace('</head>', `    ${articleMeta}\n  </head>`);
  }
  if (body) {
    html = injectBody(html, body);
  }
  return html;
}

async function writeRoute(routePath, html) {
  const outDir = join(dist, routePath);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'index.html'), html, 'utf8');
}

/* ── run ─────────────────────────────────────────────────────────────── */
async function main() {
  const templatePath = join(dist, 'index.html');
  let template;
  try {
    template = await readFile(templatePath, 'utf8');
  } catch {
    throw new Error(`Cannot read ${templatePath} — run "vite build" before prerender.`);
  }

  // Import the post data directly (Node strips the TS types).
  const postsModUrl = pathToFileURL(
    join(root, 'src/features/blog/services/posts.data.ts'),
  ).href;
  const { MOCK_POSTS } = await import(postsModUrl);

  // site.ts is pure data (no runtime imports) → Node can import it directly.
  const { profile, intakes, courses, products } = await import(
    pathToFileURL(join(root, 'src/content/site.ts')).href
  );
  // Same JSON-LD the React product page renders (pure module, types only).
  const { productJsonLd } = await import(
    pathToFileURL(join(root, 'src/features/marketplace/seo.ts')).href
  );

  let count = 0;

  // Top-level static routes (homepage keeps dist/index.html as-is).
  const contactTitle = 'Contact Sharad Bhandari — Hire a Senior Software Engineer in Nepal';
  const contactLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: contactTitle,
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#sharad-bhandari`,
      name: 'Sharad Bhandari',
      jobTitle: 'Senior Software Engineer',
      email: `mailto:${profile.email}`,
      telephone: profile.phone,
      address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Hiring & project enquiries',
        email: profile.email,
        telephone: profile.phone,
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Nepali'],
      },
    },
  };

  // ItemList of all published articles — helps the writing index surface in search.
  const publishedPosts = MOCK_POSTS.filter((p) => p.published !== false);
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Articles by Sharad Bhandari',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: publishedPosts.length,
    itemListElement: publishedPosts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/blog/${p.slug}`,
      name: p.title,
    })),
  };

  const tuitionTitle = 'Learn Python Online — Python Classes & Coaching in Kathmandu, Nepal';
  const tuitionDesc =
    'Learn Python online with live, small-group coaching from Sharad Bhandari — a senior software engineer in Kathmandu, Nepal with 7+ years’ experience. Python classes for beginners through to backend development (Django, FastAPI). ' +
    `The ${intakes.current.label} batch is running now — enroll free for the ${intakes.next.label} batch, no payment needed.`;
  const tuitionKeywords =
    'Python online coaching, learn Python online, Python classes in Kathmandu, Python tuition in Nepal, ' +
    'Python programming course Nepal, online Python classes Nepal, Python for beginners, learn to code Nepal, ' +
    'Python coaching Kathmandu, Django FastAPI course, Python bootcamp Nepal, coding classes Kathmandu, ' +
    'Python instructor Nepal, live Python classes online, Python training Nepal';
  const tuitionProvider = {
    '@type': 'Person',
    name: 'Sharad Bhandari',
    url: SITE_URL,
    jobTitle: 'Senior Software Engineer & Python Instructor',
    address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  };
  // Array of schema.org objects rendered in one JSON-LD block: a Course and a
  // locality-tagged Service, so "Python coaching / classes in Kathmandu, Nepal"
  // is understood by search engines.
  const tuitionLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Python Programming Classes & Coaching',
      description: tuitionDesc,
      inLanguage: ['en', 'ne'],
      provider: tuitionProvider,
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        // The intake open for enrolment — not the one already in class.
        startDate: intakes.next.startDate,
        location: { '@type': 'VirtualLocation', url: `${SITE_URL}/tuition` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Python programming coaching & tuition',
      provider: tuitionProvider,
      areaServed: [
        { '@type': 'City', name: 'Kathmandu' },
        { '@type': 'Country', name: 'Nepal' },
        'Worldwide (online)',
      ],
      url: `${SITE_URL}/tuition`,
    },
  ];

  const STATIC_ROUTES = [
    { path: 'projects', title: 'Work — Sharad Bhandari', h1: 'Selected work by Sharad Bhandari', description: 'Selected projects and engineering work by Sharad Bhandari, Senior Software Engineer.' },
    { path: 'experience', title: 'Experience — Sharad Bhandari', h1: 'Experience — Sharad Bhandari', description: 'Professional experience and career journey of Sharad Bhandari, Senior Software Engineer.' },
    {
      path: 'tuition',
      title: tuitionTitle,
      h1: 'Learn Python online — coaching & classes in Kathmandu, Nepal',
      description: tuitionDesc,
      keywords: tuitionKeywords,
      ld: tuitionLd,
      extra:
        `\n      <p>The ${intakes.current.label} batch is running now. New enrolments are for the ${intakes.next.label} batch.</p>` +
        `\n      <ul>${courses
          .map(
            (c) =>
              `<li>${escAttr(c.title)} — ${escAttr(c.days)}, ${c.sessionsPerWeek}× / week. ` +
              `Next batch: ${intakes.next.label}, starts ${c.startDate}.</li>`,
          )
          .join('')}</ul>`,
    },
    {
      path: 'marketplace',
      title: 'Marketplace — Buy Ready-Made Applications by Sharad Bhandari',
      h1: 'Ready-made applications built by Sharad Bhandari',
      description:
        'Ready-made web and mobile applications built by Sharad Bhandari, a senior software engineer in Kathmandu, Nepal. Buy at the listed price or make an offer — full source code, deployment and support included.',
      extra: `\n      <ul>${products
        .map((p) => `<li><a href="/marketplace/${escAttr(p.slug)}">${escAttr(p.name)}</a> — ${escAttr(p.tagline)}</li>`)
        .join('')}</ul>`,
    },
    { path: 'blog', title: 'Writing — Sharad Bhandari', h1: 'Writing by Sharad Bhandari', description: 'Articles and notes on software engineering, architecture, and building for the web by Sharad Bhandari.', ld: blogLd },
    { path: 'contact', title: contactTitle, h1: 'Hire a Senior Software Engineer in Nepal', description: 'Hire Sharad Bhandari — senior software engineer & Python / backend developer in Kathmandu, Nepal. Available for full-time, freelance, contract and remote roles worldwide.', ld: contactLd },
  ];

  // Homepage: keep its meta from the template, inject a static <h1> + nav for crawlers.
  const homeBody = bodyHtml(
    'Sharad Bhandari',
    'Senior Software Engineer & backend developer based in Kathmandu, Nepal. 7+ years building scalable, cloud-ready systems, APIs and async architectures.',
    `\n      <nav aria-label="Primary">\n        <a href="/projects">Work</a>\n        <a href="/experience">Experience</a>\n        <a href="/marketplace">Marketplace</a>\n        <a href="/tuition">Learn Python with Me</a>\n        <a href="/blog">Writing</a>\n        <a href="/contact">Contact</a>\n      </nav>`,
  );
  await writeFile(templatePath, injectBody(template, homeBody), 'utf8');

  for (const r of STATIC_ROUTES) {
    const html = applyMeta(template, {
      title: r.title,
      description: r.description,
      keywords: r.keywords,
      url: `${SITE_URL}/${r.path}`,
      image: FALLBACK_IMAGE,
      ogType: 'website',
      articleMeta: r.ld ? `<script type="application/ld+json">${JSON.stringify(r.ld)}</script>` : undefined,
      body: bodyHtml(r.h1, r.description, r.extra ?? ''),
    });
    await writeRoute(r.path, html);
    count++;
  }

  // One static HTML file per marketplace product — the page that ranks for
  // searches like "expense tracker app source code". The fallback body carries
  // the full copy (overview, feature sections, FAQ) so no-JS crawlers index it.
  const list = (items) => `<ul>${items.map((i) => `<li>${escAttr(i)}</li>`).join('')}</ul>`;
  for (const p of products) {
    const url = `${SITE_URL}/marketplace/${p.slug}`;
    const title = p.seo?.title ?? `${p.name} — ${p.tagline}`;
    const description = p.seo?.description ?? p.summary;
    const price = p.currency === 'NPR' ? `Rs. ${p.askingPrice.toLocaleString('en-IN')}` : `$${p.askingPrice.toLocaleString('en-US')}`;
    const extra = [
      ...(p.overview ?? []).map((para) => `<p>${escAttr(para)}</p>`),
      p.platforms && `<p>Platforms: ${escAttr(p.platforms.join(', '))}</p>`,
      `<p>Asking price: ${escAttr(price)}${p.minimumBid !== undefined ? ' — offers welcome' : ''}.</p>`,
      `<h2>Features</h2>${list(p.features)}`,
      ...(p.sections ?? []).map(
        (sec) => `<h2>${escAttr(sec.heading)}</h2><p>${escAttr(sec.body)}</p>${sec.points ? list(sec.points) : ''}`,
      ),
      `<h2>What you get</h2>${list(p.includes)}`,
      `<h2>Built with</h2>${list(p.techStack)}`,
      p.audiences && `<h2>A great fit for</h2>${list(p.audiences)}`,
      p.faq &&
        `<h2>Questions about ${escAttr(p.name)}</h2><dl>${p.faq
          .map(({ q, a }) => `<dt>${escAttr(q)}</dt><dd>${escAttr(a)}</dd>`)
          .join('')}</dl>`,
      `<p><a href="/marketplace">Browse all applications in the marketplace</a></p>`,
    ]
      .filter(Boolean)
      .map((x) => `\n      ${x}`)
      .join('');

    const html = applyMeta(template, {
      title,
      description,
      keywords: p.seo?.keywords.join(', '),
      url,
      image: absImage(p.ogImage ?? p.logo),
      ogType: 'product',
      articleMeta: productJsonLd(p, SITE_URL, profile.name)
        .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
        .join('\n    '),
      body: bodyHtml(p.name, p.tagline, extra),
    });
    await writeRoute(`marketplace/${p.slug}`, html);
    count++;
  }

  // One static HTML file per published blog post.
  for (const post of MOCK_POSTS) {
    if (post.published === false) continue;
    const tags = Array.isArray(post.tags) ? post.tags : [];
    const image = absImage(post.coverImage);
    // Search-facing copy: prefer the post's dedicated SEO fields, else excerpt/tags.
    const description = post.seo?.description || post.excerpt;
    const keywords = (
      post.seo?.keywords?.length ? post.seo.keywords : tags.map((t) => t.name)
    ).join(', ');
    const metaTags = [
      post.publishedAt && `<meta property="article:published_time" content="${escAttr(post.publishedAt)}" />`,
      `<meta property="article:author" content="Sharad Bhandari" />`,
      post.category?.name && `<meta property="article:section" content="${escAttr(post.category.name)}" />`,
      ...tags.map((t) => `<meta property="article:tag" content="${escAttr(t.name)}" />`),
    ].filter(Boolean);

    // BlogPosting structured data — helps the post rank for its topic.
    const blogPostingLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      image,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Person',
        '@id': `${SITE_URL}/#sharad-bhandari`,
        name: 'Sharad Bhandari',
        url: `${SITE_URL}/`,
      },
      publisher: { '@id': `${SITE_URL}/#sharad-bhandari` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
      articleSection: post.category?.name,
      keywords,
      inLanguage: 'en',
    };
    const articleMeta = [
      ...metaTags,
      `<script type="application/ld+json">${JSON.stringify(blogPostingLd)}</script>`,
    ].join('\n    ');

    const html = applyMeta(template, {
      title: `${post.title} — Sharad Bhandari`,
      description,
      keywords,
      url: `${SITE_URL}/blog/${post.slug}`,
      image,
      ogType: 'article',
      articleMeta,
      body: bodyHtml(post.title, description),
    });
    await writeRoute(`blog/${post.slug}`, html);
    count++;
  }

  // Regenerate sitemap.xml so every post is discoverable (helps topic ranking).
  // This overwrites the copy Vite places from public/ — dist/ is the source of truth on deploy.
  const today = new Date().toISOString().slice(0, 10);
  const urlEntry = (loc, { lastmod = today, changefreq = 'monthly', priority = '0.7', image } = {}) => {
    const img = image
      ? `\n    <image:image>\n      <image:loc>${escAttr(image.loc)}</image:loc>\n      <image:title>${escAttr(image.title)}</image:title>\n    </image:image>`
      : '';
    return `  <url>\n    <loc>${escAttr(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${img}\n  </url>`;
  };

  const urls = [
    urlEntry(`${SITE_URL}/`, { priority: '1.0', image: { loc: FALLBACK_IMAGE, title: 'Sharad Bhandari — Senior Software Engineer' } }),
    urlEntry(`${SITE_URL}/projects`, { priority: '0.8' }),
    urlEntry(`${SITE_URL}/experience`, { priority: '0.8' }),
    urlEntry(`${SITE_URL}/tuition`, { changefreq: 'weekly', priority: '0.8' }),
    urlEntry(`${SITE_URL}/marketplace`, { changefreq: 'weekly', priority: '0.7' }),
    ...products.map((p) =>
      urlEntry(`${SITE_URL}/marketplace/${p.slug}`, {
        changefreq: 'weekly',
        priority: '0.8',
        image: p.ogImage || p.logo ? { loc: absImage(p.ogImage ?? p.logo), title: p.seo?.title ?? p.name } : undefined,
      }),
    ),
    urlEntry(`${SITE_URL}/blog`, { changefreq: 'weekly', priority: '0.7' }),
    urlEntry(`${SITE_URL}/contact`, { changefreq: 'yearly', priority: '0.6' }),
    ...MOCK_POSTS.filter((p) => p.published !== false).map((p) =>
      urlEntry(`${SITE_URL}/blog/${p.slug}`, {
        lastmod: (p.updatedAt || p.publishedAt || '').slice(0, 10) || today,
        priority: '0.7',
        image: p.coverImage ? { loc: absImage(p.coverImage), title: p.title } : undefined,
      }),
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset\n  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n>\n${urls.join('\n')}\n</urlset>\n`;
  await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');

  console.log(`✓ prerendered ${count} routes (${STATIC_ROUTES.length} static + ${products.length} products + ${count - STATIC_ROUTES.length - products.length} posts) + sitemap.xml (${urls.length} urls)`);
}

main().catch((err) => {
  console.error('✗ prerender failed:', err.message);
  process.exit(1);
});
