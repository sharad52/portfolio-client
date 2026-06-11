import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, PenLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogCard } from '@/features/blog/components/BlogCard';
import { BlogService } from '@/features/blog/services/blogService';
import { BlogPost } from '@/features/blog/types';
import { AuroraBackground, Section, SectionHeading } from '@/shared/components/ui';

const PAGE_SIZE = 9;

const CATEGORIES: { label: string; slug: string | null }[] = [
  { label: 'All', slug: null },
  { label: 'Frontend', slug: 'frontend' },
  { label: 'Backend', slug: 'backend' },
  { label: 'AI/ML', slug: 'ai-ml' },
  { label: 'DevSecOps', slug: 'devsecops' },
];

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await BlogService.getPosts({ page, limit: PAGE_SIZE, category: category ?? undefined });
        setPosts(res.data);
        setTotalPages(res.pagination.totalPages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, category]);

  const selectCategory = (slug: string | null) => {
    setCategory(slug);
    setPage(1);
  };

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

          <div className="mb-10 flex flex-wrap gap-2.5">
            {CATEGORIES.map(({ label, slug }) => {
              const active = category === slug;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => selectCategory(slug)}
                  aria-pressed={active}
                  className={
                    active
                      ? 'rounded-full border border-white/25 bg-white/[0.08] px-4 py-2 text-sm font-medium text-fg transition-colors'
                      : 'rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-fg-muted transition-colors hover:border-white/25 hover:text-fg'
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex justify-center py-24 text-fg-muted">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : error ? (
            <p className="py-24 text-center text-red-300">{error}</p>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-white/[0.03] py-24 text-center backdrop-blur-xl">
              <PenLine className="text-accent-cyan" size={32} />
              <p className="text-lg text-fg-muted">
                {category ? 'No articles in this category yet. Check back soon.' : 'Articles are on the way. Check back soon.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              )}
            </>
          )}
        </Section>
      </div>
    </>
  );
};

/* Numbered pagination with prev/next, disabled at the ends. */
const Pagination: React.FC<{ page: number; totalPages: number; onChange: (p: number) => void }> = ({
  page,
  totalPages,
  onChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btn =
    'grid h-10 min-w-10 place-items-center rounded-full border border-line bg-white/[0.03] px-3 text-sm text-fg-muted transition-colors hover:border-white/25 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-fg-muted';

  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} className={btn} aria-label="Previous page">
        <ChevronLeft size={18} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={
            p === page
              ? 'grid h-10 min-w-10 place-items-center rounded-full border border-white/25 bg-white/[0.08] px-3 text-sm font-medium text-fg'
              : btn
          }
        >
          {p}
        </button>
      ))}

      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= totalPages} className={btn} aria-label="Next page">
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};
