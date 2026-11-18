import { profile, products } from '@/content/site';
import { getApproxLocation, formatLocation, type ApproxLocation } from '@/shared/utils/location';
import type { OfferFormData, Product } from '../types';

/**
 * ─────────────────────────────────────────────────────────────────
 *  Backend-free marketplace offers (mirrors the enrolment flow)
 * ─────────────────────────────────────────────────────────────────
 *  A "Buy now" request or a bid is delivered through the first
 *  configured channel, whichever is available:
 *    1. Google Apps Script → "Offers" sheet tab (+ email)
 *         [VITE_MARKETPLACE_SCRIPT_URL, falls back to VITE_GOOGLE_SCRIPT_URL]
 *    2. Web3Forms (email)                          [VITE_WEB3FORMS_KEY]
 *    3. WhatsApp deep link (always-available fallback)
 *
 *  No online payment is taken — you reply to accept / counter the
 *  offer and arrange payment + handover. Setup → docs/marketplace-setup.md
 * ─────────────────────────────────────────────────────────────────
 */

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || profile.whatsapp;
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const MARKETPLACE_SCRIPT_URL =
  (import.meta.env.VITE_MARKETPLACE_SCRIPT_URL as string | undefined) ||
  (import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined);

export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Format a whole amount in the listing's currency, e.g. "Rs. 1,50,000" / "$499". */
export function formatPrice(amount: number, currency: Product['currency']): string {
  if (currency === 'NPR') return `Rs. ${amount.toLocaleString('en-IN')}`;
  return `$${amount.toLocaleString('en-US')}`;
}

/** Parse a typed amount ("1,20,000", "Rs 500") into a number, or NaN. */
export function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d.]/g, '');
  return digits ? Number(digits) : NaN;
}

/**
 * Validate the offer against the listing. Returns an error message, or null
 * if it's acceptable. "Buy now" always uses the asking price.
 */
export function validateOffer(data: OfferFormData, product: Product): string | null {
  if (data.offerType === 'buy') return null;
  if (product.minimumBid === undefined) return 'This application is only sold at its listed price.';
  const amount = parseAmount(data.amount);
  if (!Number.isFinite(amount) || amount <= 0) return 'Please enter a valid offer amount.';
  if (amount < product.minimumBid) {
    return `The minimum offer is ${formatPrice(product.minimumBid, product.currency)}.`;
  }
  return null;
}

/** Resolve the product name and the final amount label from the form. */
function resolveLabels(data: OfferFormData): { product: string; offer: string; amount: string } {
  const productObj = products.find((p) => p.slug === data.productSlug);
  const product = productObj?.name || data.productSlug;
  if (!productObj) return { product, offer: data.offerType, amount: data.amount };
  const value = data.offerType === 'buy' ? productObj.askingPrice : parseAmount(data.amount);
  return {
    product,
    offer: data.offerType === 'buy' ? 'Buy now (asking price)' : 'Bid',
    amount: Number.isFinite(value) ? formatPrice(value, productObj.currency) : data.amount,
  };
}

/** Compose a WhatsApp message from the offer form. */
export function whatsAppFromOffer(data: OfferFormData): string {
  const { product, offer, amount } = resolveLabels(data);
  const lines = [
    data.offerType === 'buy'
      ? `Hi Sharad, I'd like to buy ${product} from your marketplace.`
      : `Hi Sharad, I'd like to make an offer on ${product} from your marketplace.`,
    '',
    `Application: ${product}`,
    `Type: ${offer}`,
    `Amount: ${amount}`,
    data.name ? `Name: ${data.name}` : '',
    data.phone ? `Phone: ${data.phone}` : '',
    data.email ? `Email: ${data.email}` : '',
    data.message ? `Message: ${data.message}` : '',
  ].filter(Boolean);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** WhatsApp link asking for a walkthrough of a product before buying. */
export function whatsAppDemoRequest(product: Product): string {
  const text = `Hi Sharad, I'm interested in ${product.name} from your marketplace. Could you show me a demo?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** True if any email/sheet delivery channel is configured. */
export const isOfferConfigured = (): boolean => Boolean(MARKETPLACE_SCRIPT_URL || WEB3FORMS_KEY);

/** Submit to a Google Apps Script web app (saves to the Offers tab + emails you). */
async function submitToGoogleSheet(data: OfferFormData, loc: ApproxLocation | null): Promise<SubmitResult> {
  const { product, offer, amount } = resolveLabels(data);
  try {
    // Same opaque no-cors POST as the contact / enrolment forms — `type`
    // routes it to the Offers tab in the Apps Script.
    await fetch(MARKETPLACE_SCRIPT_URL!, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        type: 'offer',
        name: data.name,
        email: data.email,
        phone: data.phone,
        product,
        offerType: offer,
        amount,
        message: data.message || '',
        location: formatLocation(loc),
        ip: loc?.ip || '',
        source: 'sharadbhandari.com.np',
      }),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please try WhatsApp instead.' };
  }
}

/** Submit to Web3Forms (email delivery, no backend). */
async function submitToWeb3Forms(data: OfferFormData, loc: ApproxLocation | null): Promise<SubmitResult> {
  const { product, offer, amount } = resolveLabels(data);
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New marketplace ${data.offerType === 'buy' ? 'purchase request' : 'bid'}: ${product} — ${amount}`,
        from_name: 'sharadbhandari.com.np',
        name: data.name,
        email: data.email,
        phone: data.phone,
        product,
        offer_type: offer,
        amount,
        message: data.message || '(no message)',
        location: formatLocation(loc) || 'Unknown',
        ip: loc?.ip || '',
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json?.success) return { ok: true };
    return { ok: false, error: json?.message || 'Something went wrong. Please try again.' };
  } catch {
    return { ok: false, error: 'Network error. Please try WhatsApp instead.' };
  }
}

/** Submit an offer through the first configured channel. */
export async function submitOffer(data: OfferFormData): Promise<SubmitResult> {
  const loc = await getApproxLocation();
  if (MARKETPLACE_SCRIPT_URL) return submitToGoogleSheet(data, loc);
  if (WEB3FORMS_KEY) return submitToWeb3Forms(data, loc);
  return { ok: false, error: 'Offer delivery is not configured yet.' };
}

export const OfferService = {
  submitOffer,
  whatsAppFromOffer,
  isOfferConfigured,
  validateOffer,
  formatPrice,
};
