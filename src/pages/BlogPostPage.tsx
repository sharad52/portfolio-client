import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { Helmet } from 'react-helmet-async';
import { BlogService } from '@/features/blog/services/blogService';
import { BlogPost } from '@/features/blog/types';
import { formatDate } from '@/shared/utils/helpers';
import { ROUTES } from '@/core/routes';
import { Link } from 'react-router-dom';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
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
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to={ROUTES.BLOG} replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.excerpt} />
        {post.seo?.keywords && (
          <meta name="keywords" content={post.seo.keywords.join(', ')} />
        )}
      </Helmet>

      <article className="min-h-screen bg-cream py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            to={ROUTES.BLOG}
            className="inline-flex items-center gap-2 text-ink hover:text-accent transition-colors mb-8 font-body"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-accent/20 text-ink font-mono text-sm mb-4">
                {post.category.name}
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-ink/60 mb-6">
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {post.publishedAt && formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} />
                {post.readingTime} min read
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full border-2 border-ink"
                />
              )}
              <div>
                <p className="font-body text-lg font-semibold text-ink">
                  {post.author.name}
                </p>
                {post.author.bio && (
                  <p className="text-sm text-ink/60">{post.author.bio}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-ink text-cream text-sm font-mono"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </motion.header>

          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 border-4 border-ink shadow-[16px_16px_0px_0px_rgba(15,15,15,1)]"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none font-body text-ink
              prose-headings:font-display prose-headings:text-ink
              prose-a:text-accent-dark prose-a:no-underline hover:prose-a:underline
              prose-code:bg-accent/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-ink prose-pre:text-cream prose-pre:border-2 prose-pre:border-ink
              prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4
              prose-img:border-2 prose-img:border-ink"
          >
            <Markdown>{post.content}</Markdown>
          </motion.div>
        </div>
      </article>
    </>
  );
};
