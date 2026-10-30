import type { Product, ProductStatus } from '@/content/site';

export type { Product, ProductStatus };

/** 'buy' = accept the asking price; 'bid' = propose a lower/custom amount. */
export type OfferType = 'buy' | 'bid';

/** What a visitor submits from the /marketplace page. */
export interface OfferFormData {
  name: string;
  email: string;
  phone: string;
  productSlug: string; // which application they want
  offerType: OfferType;
  amount: string;      // kept as typed; validated against minimumBid on submit
  message?: string;    // intended use, timeline, questions (optional)
}
