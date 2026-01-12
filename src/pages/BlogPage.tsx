import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '@/features/blog/components/BlogCard';
import { BlogService } from '@/features/blog/services/blogService';
import { BlogPost } from '@/features/blog/types';
import { Helmet } from 'react-helmet-async';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await BlogService.getPosts({ page: 1, limit: 10 });
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog | Developer Portfolio</title>
        <meta name="description" content="Read my latest articles about web development, programming, and technology." />
      </Helmet>

      <div className="min-h-screen bg-cream py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="font-display text-6xl md:text-7xl font-bold text-ink mb-4">
              Blog
            </h1>
            <div className="h-1 w-32 bg-accent mb-6" />
            <p className="font-body text-xl text-ink/70 max-w-2xl">
              Thoughts, tutorials, and insights about web development and technology.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-600">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-ink/60">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
