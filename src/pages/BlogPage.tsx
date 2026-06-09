import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, PenLine } from 'lucide-react';
import { BlogCard } from '@/features/blog/components/BlogCard';
import { BlogService } from '@/features/blog/services/blogService';
import { BlogPost } from '@/features/blog/types';
import { AuroraBackground, Section, SectionHeading } from '@/shared/components/ui';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await BlogService.getPosts({ page: 1, limit: 12 });
        setPosts(res.data);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Writing — Sharad Bhandari</title>
        <meta name="description" content="Articles and notes on software engineering, architecture, and building for the web." />
      </Helmet>

      <div className="relative pt-32">
        <AuroraBackground />
        <Section className="pt-0">
          <SectionHeading
            eyebrow="Writing"
            title={<>Notes & <span className="gradient-text">articles</span></>}
            intro="Thoughts on architecture, engineering practice, and lessons from shipping real systems."
          />

          {loading ? (
            <div className="flex justify-center py-24 text-fg-muted">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : error ? (
            <p className="py-24 text-center text-red-300">{error}</p>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-white/[0.03] py-24 text-center backdrop-blur-xl">
              <PenLine className="text-accent-cyan" size={32} />
              <p className="text-lg text-fg-muted">Articles are on the way. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </Section>
      </div>
    </>
  );
};
