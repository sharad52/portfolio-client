import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Loader2, Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { Helmet } from 'react-helmet-async';
import { BlogService } from '@/features/blog/services/blogService';
import { BlogPost } from '@/features/blog/types';
import { formatDate } from '@/shared/utils/helpers';
import { ROUTES } from '@/core/routes';
import { seo } from '@/content/site';
import { AuroraBackground } from '@/shared/components/ui';

/** Resolve a (possibly relative) image path to an absolute URL — OG/Twitter require absolute. */
const absoluteImage = (path?: string): string => {
  if (!path) return seo.ogImage;
  return path.startsWith('http') ? path : `${seo.siteUrl}${path}`;
};

/* Renders fenced code blocks as a faux editor window: title bar with
   traffic-light dots + a language label, then the scrollable code area. */
const EditorCodeBlock: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const child = React.Children.toArray(children)[0];
  const className = React.isValidElement(child)
    ? ((child.props as { className?: string }).className ?? '')
    : '';
  const lang = className.replace('lang-', '') || 'code';

  return (
    <div className="not-prose my-7 overflow-hidden rounded-xl border border-line bg-[#0d1117] shadow-card">
      <div className="flex items-center gap-2 border-b border-line bg-white/[0.04] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <span className="ml-2 select-none font-mono text-xs lowercase tracking-wide text-fg-faint">{lang}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed text-[#e6edf3]">
        {children}
      </pre>
    </div>
  );
};

/* Decorated in-content headings — a gradient accent bar before each title. */
const H2: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-14 mb-5 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-fg before:h-7 before:w-1.5 before:rounded-full before:bg-gradient-to-b before:from-accent-cyan before:to-accent before:content-['']">
    {children}
  </h2>
);

const H3: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <h3 className="mt-10 mb-3 font-display text-lg font-semibold tracking-tight text-accent-cyan">
    {children}
  </h3>
);

const MARKDOWN_OPTIONS = {
  overrides: {
    pre: { component: EditorCodeBlock },
    h2: { component: H2 },
    h3: { component: H3 },
  },
};

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await BlogService.getPostBySlug(slug);
        setPost(data);
        setError(!data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-fg-muted">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }
  if (error || !post) return <Navigate to={ROUTES.BLOG} replace />;

  // Article structured data — lets search engines surface this post for its topic.
  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: absoluteImage(post.coverImage),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      '@id': `${seo.siteUrl}/#sharad-bhandari`,
      name: 'Sharad Bhandari',
      url: `${seo.siteUrl}/`,
    },
    publisher: { '@id': `${seo.siteUrl}/#sharad-bhandari` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${seo.siteUrl}/blog/${post.slug}` },
    articleSection: post.category?.name,
    keywords: post.tags?.map((t) => t.name).join(', '),
    inLanguage: 'en',
  };

  return (
    <>
      <Helmet>
        <title>{post.title} — Sharad Bhandari</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`${seo.siteUrl}/blog/${post.slug}`} />

        {/* Open Graph — article-specific (also baked into static HTML by scripts/prerender.mjs) */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Sharad Bhandari" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`${seo.siteUrl}/blog/${post.slug}`} />
        <meta property="og:image" content={absoluteImage(post.coverImage)} />
        <meta property="og:image:alt" content={post.title} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content="Sharad Bhandari" />
        {post.category?.name && <meta property="article:section" content={post.category.name} />}
        {post.tags?.map((t) => <meta property="article:tag" content={t.name} key={t.id} />)}

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={absoluteImage(post.coverImage)} />
        <meta name="twitter:image:alt" content={post.title} />

        <script type="application/ld+json">{JSON.stringify(blogPostingLd)}</script>
      </Helmet>

      <div className="relative pt-32">
        <AuroraBackground />
        <article className="mx-auto max-w-3xl px-6 pb-24">
          <Link to={ROUTES.BLOG} className="mb-10 inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg">
            <ArrowLeft size={18} /> Back to writing
          </Link>

          <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="chip mb-5">{post.category.name}</span>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-fg-faint">
              <span className="inline-flex items-center gap-1.5"><Calendar size={15} />{post.publishedAt && formatDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={15} />{post.readingTime} min read</span>
            </div>
          </motion.header>

          {post.coverImage && (
            <motion.img
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              src={post.coverImage}
              alt={post.title}
              decoding="async"
              className="mt-10 w-full rounded-3xl border border-line"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}

          <div
            className="prose prose-invert mt-12 max-w-none
              prose-headings:font-display prose-headings:tracking-tight
              prose-a:text-accent-cyan prose-a:no-underline hover:prose-a:underline
              prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5
              prose-pre:rounded-2xl prose-pre:border prose-pre:border-line prose-pre:bg-black/40
              prose-blockquote:border-l-accent prose-strong:text-fg prose-p:text-fg-muted prose-li:text-fg-muted"
          >
            <Markdown options={MARKDOWN_OPTIONS}>{post.content}</Markdown>
          </div>

          <ShareBar title={post.title} />
        </article>
      </div>
    </>
  );
};

/* Social share row — no backend, uses each network's web intent URL. */
const ShareBar: React.FC<{ title: string }> = ({ title }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: 'Share on X', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: 'Share on Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'Share on LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-line pt-8">
      <span className="text-sm text-fg-muted">Share this article</span>
      <div className="flex items-center gap-2">
        {links.map(({ label, icon: IconCmp, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/[0.03] text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
          >
            <IconCmp size={17} />
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/[0.03] text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
        >
          {copied ? <Check size={17} className="text-emerald-400" /> : <Link2 size={17} />}
        </button>
      </div>
    </div>
  );
};
