import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types';
import { formatDate } from '@/shared/utils/helpers';
import { createBlogPostRoute } from '@/core/routes';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white/[0.03] backdrop-blur-xl transition-colors hover:border-white/20"
  >
    {post.coverImage && (
      <div className="overflow-hidden border-b border-line">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
        />
      </div>
    )}

    <div className="flex flex-grow flex-col p-7">
      <div className="mb-4 flex items-center gap-4 text-xs text-fg-faint">
        <span className="inline-flex items-center gap-1.5"><Calendar size={14} />{post.publishedAt && formatDate(post.publishedAt)}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={14} />{post.readingTime} min</span>
      </div>

      <span className="chip mb-3 w-fit">{post.category.name}</span>

      <h3 className="font-display text-xl font-semibold text-fg">
        <Link to={createBlogPostRoute(post.slug)} className="transition-colors hover:text-accent-cyan">
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 flex-grow text-sm leading-relaxed text-fg-muted line-clamp-3">{post.excerpt}</p>

      <Link
        to={createBlogPostRoute(post.slug)}
        className="group/link mt-6 inline-flex items-center gap-1 text-sm text-accent-cyan"
      >
        Read article
        <ArrowUpRight size={15} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
      </Link>
    </div>
  </motion.article>
);
