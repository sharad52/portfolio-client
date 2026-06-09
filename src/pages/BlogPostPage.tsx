import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { Helmet } from 'react-helmet-async';
import { BlogService } from '@/features/blog/services/blogService';
import { BlogPost } from '@/features/blog/types';
import { formatDate } from '@/shared/utils/helpers';
import { ROUTES } from '@/core/routes';
import { AuroraBackground } from '@/shared/components/ui';

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

  return (
    <>
      <Helmet>
        <title>{post.title} — Sharad Bhandari</title>
        <meta name="description" content={post.excerpt} />
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
            <Markdown>{post.content}</Markdown>
          </div>
        </article>
      </div>
    </>
  );
};
