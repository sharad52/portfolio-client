import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Code2, Gavel, MessageCircle, ShieldCheck } from 'lucide-react';
import { profile, seo, products } from '@/content/site';
import type { OfferType, Product } from '@/features/marketplace/types';
import { ProductCard } from '@/features/marketplace/components/ProductCard';
import { OfferDialog } from '@/features/marketplace/components/OfferDialog';
import { AuroraBackground, Reveal, Section } from '@/shared/components/ui';

const TITLE = 'Marketplace — Buy Ready-Made Applications by Sharad Bhandari';
const DESC =
  `Ready-made web and mobile applications built by ${profile.name}, a senior software engineer in Kathmandu, Nepal. Buy at the listed price or make an offer — full source code, deployment and support included.`;

const STEPS = [
  { icon: Code2, label: 'Pick an app', sub: 'Browse what I have built' },
  { icon: Gavel, label: 'Buy or bid', sub: 'Pay the price or make an offer' },
  { icon: MessageCircle, label: 'We agree', sub: 'I reply on WhatsApp / email' },
  { icon: ShieldCheck, label: 'Handover', sub: 'Code, deploy & support' },
] as const;

const FAQ = [
  {
    q: 'How does buying work?',
    a: "Click Buy now or Make an offer on an application and send your details. Nothing is charged on this site — I'll contact you over WhatsApp or email to agree the deal, then share payment options and hand everything over.",
  },
  {
    q: 'How does bidding work?',
    a: "Offer any amount at or above the listed minimum. I review every offer and will accept, counter, or let you know if a better one is on the table. An offer isn't binding until we both agree.",
  },
  {
    q: 'What do I get?',
    a: 'Each listing says exactly what is included — typically the full source code with ownership, help deploying it to your own server or app store accounts, and a period of bug-fix support.',
  },
  {
    q: 'Can you customise or rebrand an application for me?',
    a: "Yes. Mention what you need in the offer form — rebranding, new features or integrations — and I'll quote the customisation alongside the purchase.",
  },
] as const;

const productsLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Applications by ${profile.name}`,
  itemListElement: products.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: p.name,
      description: p.summary,
      applicationCategory: p.category,
      ...(p.logo && { image: `${seo.siteUrl}${p.logo}` }),
      offers: {
        '@type': 'Offer',
        price: p.askingPrice,
        priceCurrency: p.currency,
        availability: p.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        url: `${seo.siteUrl}/marketplace`,
      },
      author: { '@type': 'Person', name: profile.name, url: seo.siteUrl },
    },
  })),
};

export const MarketplacePage: React.FC = () => {
  const [active, setActive] = useState<{ product: Product; type: OfferType } | null>(null);

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={`${seo.siteUrl}/marketplace`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sharad Bhandari" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={`${seo.siteUrl}/marketplace`} />
        <meta property="og:image" content={seo.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={seo.ogImage} />

        <script type="application/ld+json">{JSON.stringify(productsLd)}</script>
      </Helmet>

      <div className="relative pt-32">
        <AuroraBackground />
        <Section className="pt-0">
          {/* Hero */}
          <div className="mb-14 max-w-2xl">
            <Reveal>
              <span className="chip mb-5 w-fit">Marketplace</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-4xl font-medium tracking-tight text-fg md:text-5xl">
                Ready-made <span className="gradient-text">applications</span>, built by me
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg text-fg-muted">
                Production-ready products I've designed and built end-to-end. Buy one at the listed price or
                make an offer — you get the full source code, help deploying it, and support from the
                engineer who wrote it.
              </p>
            </Reveal>
          </div>

          {/* How it works */}
          <Reveal delay={0.15}>
            <div className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STEPS.map(({ icon: StepIcon, label, sub }, i) => (
                <div key={label} className="rounded-2xl border border-line bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <StepIcon size={20} className="text-accent-cyan" />
                    <span className="font-mono text-xs text-fg-faint">0{i + 1}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-fg">{label}</p>
                  <p className="text-xs text-fg-faint">{sub}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Listings */}
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-fg">Available applications</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={i}
                onAction={(p, type) => setActive({ product: p, type })}
              />
            ))}
          </div>

          {/* FAQ */}
          <Reveal>
            <div className="mt-16 max-w-3xl border-t border-line pt-10">
              <h2 className="font-display text-2xl font-semibold text-fg">Questions, answered</h2>
              <dl className="mt-8 space-y-6">
                {FAQ.map(({ q, a }) => (
                  <div key={q}>
                    <dt className="font-display text-lg font-medium text-fg">{q}</dt>
                    <dd className="mt-1.5 text-fg-muted">{a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Section>
      </div>

      <OfferDialog
        product={active?.product ?? null}
        offerType={active?.type ?? 'buy'}
        onClose={() => setActive(null)}
      />
    </>
  );
};

export default MarketplacePage;
