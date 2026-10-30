import type { Product } from '@/content/site';

/**
 * Structured data for a product page (/marketplace/<slug>). Shared by the
 * React page (Helmet) and scripts/prerender.mjs, so crawlers that don't run
 * JS see exactly the same JSON-LD. Keep this file free of runtime imports —
 * Node imports it directly (type imports are stripped).
 */
export function productJsonLd(product: Product, siteUrl: string, sellerName: string): object[] {
  const url = `${siteUrl}/marketplace/${product.slug}`;
  const image = [product.ogImage, product.logo].filter(Boolean).map((p) => `${siteUrl}${p}`);
  const seller = { '@type': 'Person', name: sellerName, url: siteUrl };

  const ld: object[] = [
    {
      '@context': 'https://schema.org',
      // Both: Product unlocks price/offer details, SoftwareApplication says what it is.
      '@type': ['Product', 'SoftwareApplication'],
      '@id': `${url}#product`,
      name: product.name,
      description: product.seo?.description ?? product.summary,
      image,
      url,
      brand: { '@type': 'Brand', name: product.name },
      category: product.category,
      applicationCategory: 'FinanceApplication',
      operatingSystem: (product.platforms ?? []).join(', ') || undefined,
      keywords: product.seo?.keywords.join(', '),
      featureList: product.features,
      author: seller,
      offers: {
        '@type': 'Offer',
        url,
        price: product.askingPrice,
        priceCurrency: product.currency,
        availability:
          product.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Marketplace', item: `${siteUrl}/marketplace` },
        { '@type': 'ListItem', position: 3, name: product.name, item: url },
      ],
    },
  ];

  if (product.faq?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: product.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }
  return ld;
}
