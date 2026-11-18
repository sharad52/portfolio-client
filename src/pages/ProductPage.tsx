import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Gavel, MessageCircle, ShoppingCart } from 'lucide-react';
import { profile, seo, products } from '@/content/site';
import type { OfferType } from '@/features/marketplace/types';
import { OfferDialog } from '@/features/marketplace/components/OfferDialog';
import { formatPrice, whatsAppDemoRequest } from '@/features/marketplace/services/offerService';
import { productJsonLd } from '@/features/marketplace/seo';
import { ROUTES } from '@/core/routes';
import { AuroraBackground, Icon, Reveal, Section } from '@/shared/components/ui';
import { NotFoundPage } from './NotFoundPage';

/** /marketplace/:slug — one indexable page per application for sale. */
export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const [offerType, setOfferType] = useState<OfferType | null>(null);

  if (!product) return <NotFoundPage />;

  const url = `${seo.siteUrl}/marketplace/${product.slug}`;
  const title = product.seo?.title ?? `${product.name} — ${product.tagline}`;
  const description = product.seo?.description ?? product.summary;
  const image = `${seo.siteUrl}${product.ogImage ?? product.logo ?? ''}`;
  const sold = product.status === 'sold';
  const biddable = product.minimumBid !== undefined;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {product.seo && <meta name="keywords" content={product.seo.keywords.join(', ')} />}
        <link rel="canonical" href={url} />

        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Sharad Bhandari" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {productJsonLd(product, seo.siteUrl, profile.name).map((ld, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
        ))}
      </Helmet>

      <div className="relative pt-32">
        <AuroraBackground />
        <Section className="pt-0">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-fg-faint">
            <Link to={ROUTES.MARKETPLACE} className="inline-flex items-center gap-1.5 hover:text-fg">
              <ArrowLeft size={14} /> Marketplace
            </Link>
          </nav>

          {/* Hero — name, pitch, price and the two actions */}
          <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
            <div>
              <Reveal>
                <div className="flex items-center gap-4">
                  {product.logo ? (
                    <img src={product.logo} alt={`${product.name} logo`} width={72} height={72} className="h-[72px] w-[72px] rounded-2xl" />
                  ) : (
                    <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-white/[0.04] text-accent-cyan">
                      <Icon name={product.icon} size={28} />
                    </span>
                  )}
                  <div>
                    <span className="chip w-fit">{product.category}</span>
                    <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-fg md:text-5xl">
                      {product.name}
                    </h1>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-6 text-xl text-fg">{product.tagline}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-4 space-y-4 text-lg text-fg-muted">
                  {(product.overview ?? [product.summary]).map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </Reveal>
              {product.platforms && (
                <Reveal delay={0.15}>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.platforms.map((p) => (
                      <span key={p} className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-fg">
                        {p}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Purchase panel */}
            <Reveal delay={0.1}>
              <aside className="rounded-3xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl lg:sticky lg:top-28">
                <span className="block text-xs text-fg-faint">Asking price</span>
                <span className="font-display text-3xl font-semibold text-fg">
                  {formatPrice(product.askingPrice, product.currency)}
                </span>
                {biddable && (
                  <p className="mt-1 text-sm text-fg-muted">
                    Offers from {formatPrice(product.minimumBid!, product.currency)}
                  </p>
                )}
                <div className="mt-5 space-y-2">
                  <button onClick={() => setOfferType('buy')} disabled={sold} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
                    <ShoppingCart size={18} /> {sold ? 'Sold' : 'Buy now'}
                  </button>
                  {biddable && (
                    <button onClick={() => setOfferType('bid')} disabled={sold} className="btn-ghost w-full disabled:cursor-not-allowed disabled:opacity-50">
                      <Gavel size={18} /> Make an offer
                    </button>
                  )}
                  <a href={whatsAppDemoRequest(product)} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full text-sm">
                    <MessageCircle size={16} /> Ask for a demo
                  </a>
                </div>
                {product.demoUrl && (
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent-cyan hover:underline">
                    Live demo <ExternalLink size={14} />
                  </a>
                )}
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-xs text-fg-faint">You get</p>
                  <ul className="mt-2 space-y-2">
                    {product.includes.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-fg">
                        <Check size={16} className="mt-0.5 flex-shrink-0 text-accent-cyan" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </Reveal>
          </div>

          {/* Feature sections */}
          {product.sections && (
            <div className="mt-20 grid gap-6 md:grid-cols-2">
              {product.sections.map((s, i) => (
                <Reveal key={s.heading} delay={(i % 2) * 0.05}>
                  <section className="h-full rounded-3xl border border-line bg-white/[0.03] p-7 backdrop-blur-xl">
                    <h2 className="font-display text-xl font-semibold text-fg">{s.heading}</h2>
                    <p className="mt-2 text-fg-muted">{s.body}</p>
                    {s.points && (
                      <ul className="mt-4 space-y-2">
                        {s.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-sm text-fg-muted">
                            <Check size={16} className="mt-0.5 flex-shrink-0 text-accent-cyan" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </Reveal>
              ))}
            </div>
          )}

          {/* Stack + who it's for */}
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-fg">Built with</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.techStack.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-sm text-fg-muted">{t}</span>
                ))}
              </div>
            </Reveal>
            {product.audiences && (
              <Reveal delay={0.05}>
                <h2 className="font-display text-2xl font-semibold text-fg">A great fit for</h2>
                <ul className="mt-4 space-y-2">
                  {product.audiences.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-fg-muted">
                      <Check size={16} className="mt-1 flex-shrink-0 text-accent-cyan" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          {/* FAQ — crawlable copy that matches the FAQ JSON-LD */}
          {product.faq && (
            <Reveal>
              <div className="mt-16 max-w-3xl border-t border-line pt-10">
                <h2 className="font-display text-2xl font-semibold text-fg">Questions about {product.name}</h2>
                <dl className="mt-8 space-y-6">
                  {product.faq.map(({ q, a }) => (
                    <div key={q}>
                      <dt className="font-display text-lg font-medium text-fg">{q}</dt>
                      <dd className="mt-1.5 text-fg-muted">{a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          )}
        </Section>
      </div>

      <OfferDialog product={offerType ? product : null} offerType={offerType ?? 'buy'} onClose={() => setOfferType(null)} />
    </>
  );
};

export default ProductPage;
