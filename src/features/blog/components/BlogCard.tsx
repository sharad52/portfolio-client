import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import { formatDate, getTimeAgo } from '@/shared/utils/helpers';
import { createBlogPostRoute } from '@/core/routes';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-cream border-2 border-ink ${
        featured 
          ? 'p-8 shadow-[12px_12px_0px_0px_rgba(15,15,15,1)]' 
          : 'p-6 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]'
      } hover:shadow-[16px_16px_0px_0px_rgba(15,15,15,1)] transition-all duration-300`}
    >
      {post.coverImage && (
        <div className="mb-6 overflow-hidden border-2 border-ink">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex items-center gap-4 mb-4 text-sm text-ink/60">
        <span className="flex items-center gap-2">
          <Calendar size={16} />
          {post.publishedAt && formatDate(post.publishedAt)}
        </span>
        <span className="flex items-center gap-2">
          <Clock size={16} />
          {post.readingTime} min read
        </span>
      </div>

      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-accent/20 text-ink font-mono text-sm mb-3">
          {post.category.name}
        </span>
      </div>

      <h3 className={`font-display font-bold text-ink mb-3 ${
        featured ? 'text-3xl' : 'text-2xl'
      }`}>
        <Link
          to={createBlogPostRoute(post.slug)}
          className="hover:text-accent transition-colors"
        >
          {post.title}
        </Link>
      </h3>

      <p className="font-body text-lg text-ink/70 mb-4 line-clamp-3">
        {post.excerpt}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag.id}
            className="px-2 py-1 bg-ink text-cream text-sm font-mono"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      <Link
        to={createBlogPostRoute(post.slug)}
        className="inline-flex items-center gap-2 text-ink hover:text-accent transition-colors font-body text-lg group"
      >
        Read More
        <ArrowRight
          size={20}
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </motion.article>
  );
};
