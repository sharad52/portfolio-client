/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PRERENDER — bake per-route Open Graph / Twitter tags into static HTML.
 * ─────────────────────────────────────────────────────────────────────────
 *  Why: the site is a client-rendered SPA on S3 + CloudFront. Social crawlers
 *  (Facebook, LinkedIn, WhatsApp, X, Slack…) don't run JavaScript, so they only
 *  see the raw HTML at a URL. Without this step every shared link falls back to
 *  the homepage's tags (profile photo + site title). This generates a real
 *  HTML file per blog post and top-level route, each with its own title,
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
  `<h1>${escAttr(h1)}</h1>\n      <p>${escAttr(intro)}</p>${extra}`;

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
function applyMeta(template, { title, description, url, image, ogType, articleMeta, body }) {
  let html = template;
  html = setTitle(html, title);
  html = setMeta(html, 'name', 'description', clampDesc(description));
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

  // Article cover images aren't the profile portrait — drop the homepage's
  // hardcoded dimensions so platforms don't reject a size mismatch.
  if (ogType === 'article') {
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
  const { profile } = await import(pathToFileURL(join(root, 'src/content/site.ts')).href);

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

  const STATIC_ROUTES = [
    { path: 'projects', title: 'Work — Sharad Bhandari', h1: 'Selected work by Sharad Bhandari', description: 'Selected projects and engineering work by Sharad Bhandari, Senior Software Engineer.' },
    { path: 'experience', title: 'Experience — Sharad Bhandari', h1: 'Experience — Sharad Bhandari', description: 'Professional experience and career journey of Sharad Bhandari, Senior Software Engineer.' },
    { path: 'blog', title: 'Writing — Sharad Bhandari', h1: 'Writing by Sharad Bhandari', description: 'Articles and notes on software engineering, architecture, and building for the web by Sharad Bhandari.', ld: blogLd },
    { path: 'contact', title: contactTitle, h1: 'Contact Sharad Bhandari', description: 'Contact Sharad Bhandari — senior software engineer & Python developer in Kathmandu, Nepal. Available to hire for senior, freelance and remote roles.', ld: contactLd },
  ];

  // Homepage: keep its meta from the template, inject a static <h1> + nav for crawlers.
  const homeBody = bodyHtml(
    'Sharad Bhandari',
    'Senior Software Engineer & backend developer based in Kathmandu, Nepal. 7+ years building scalable, cloud-ready systems, APIs and async architectures.',
    `\n      <nav aria-label="Primary">\n        <a href="/projects">Work</a>\n        <a href="/experience">Experience</a>\n        <a href="/blog">Writing</a>\n        <a href="/contact">Contact</a>\n      </nav>`,
  );
  await writeFile(templatePath, injectBody(template, homeBody), 'utf8');

  for (const r of STATIC_ROUTES) {
    const html = applyMeta(template, {
      title: r.title,
      description: r.description,
      url: `${SITE_URL}/${r.path}`,
      image: FALLBACK_IMAGE,
      ogType: 'website',
      articleMeta: r.ld ? `<script type="application/ld+json">${JSON.stringify(r.ld)}</script>` : undefined,
      body: bodyHtml(r.h1, r.description),
    });
    await writeRoute(r.path, html);
    count++;
  }

  // One static HTML file per published blog post.
  for (const post of MOCK_POSTS) {
    if (post.published === false) continue;
    const tags = Array.isArray(post.tags) ? post.tags : [];
    const image = absImage(post.coverImage);
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
      description: post.excerpt,
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
      keywords: tags.map((t) => t.name).join(', '),
      inLanguage: 'en',
    };
    const articleMeta = [
      ...metaTags,
      `<script type="application/ld+json">${JSON.stringify(blogPostingLd)}</script>`,
    ].join('\n    ');

    const html = applyMeta(template, {
      title: `${post.title} — Sharad Bhandari`,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      image,
      ogType: 'article',
      articleMeta,
      body: bodyHtml(post.title, post.excerpt),
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

  console.log(`✓ prerendered ${count} routes (${STATIC_ROUTES.length} static + ${count - STATIC_ROUTES.length} posts) + sitemap.xml (${urls.length} urls)`);
}

main().catch((err) => {
  console.error('✗ prerender failed:', err.message);
  process.exit(1);
});
