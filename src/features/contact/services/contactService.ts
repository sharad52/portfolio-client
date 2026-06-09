import { profile } from '@/content/site';
import type { ContactFormData } from '../types';

/**
 * ─────────────────────────────────────────────────────────────────
 *  Backend-free contact handling
 * ─────────────────────────────────────────────────────────────────
 *  Delivery is tried in this order, whichever is configured:
 *    1. Google Apps Script → Google Sheet (+ email)  [VITE_GOOGLE_SCRIPT_URL]
 *    2. Web3Forms (email)                             [VITE_WEB3FORMS_KEY]
 *    3. WhatsApp deep link (always available fallback)
 *
 *  Google Sheet setup (free, no API key) → see docs/contact-google-sheet.md
 *  Web3Forms setup → https://web3forms.com (free access key)
 * ─────────────────────────────────────────────────────────────────
 */

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || profile.whatsapp;
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

/** Build a wa.me deep link with an optional prefilled message. */
export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Compose a WhatsApp message from the contact form. */
export function whatsAppFromForm(data: ContactFormData): string {
  const lines = [
    `Hi Sharad, I'm ${data.name}.`,
    data.subject ? `Subject: ${data.subject}` : '',
    '',
    data.message,
    '',
    `(Reply to: ${data.email}${data.phone ? `, ${data.phone}` : ''})`,
  ].filter(Boolean);
  return buildWhatsAppLink(lines.join('\n'));
}

/** True if any email/sheet delivery channel is configured. */
export const isFormConfigured = (): boolean => Boolean(GOOGLE_SCRIPT_URL || WEB3FORMS_KEY);

export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Submit to a Google Apps Script web app (saves to a Sheet + emails you). */
async function submitToGoogleSheet(data: ContactFormData): Promise<SubmitResult> {
  try {
    // Apps Script web apps don't send CORS headers, so we POST as a "simple
    // request" (text/plain, no-cors). The response is opaque — reaching here
    // without a network error means the script ran.
    await fetch(GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        subject: data.subject || '',
        message: data.message,
        source: 'sharadbhandari.com.np',
      }),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please try WhatsApp or email instead.' };
  }
}

/** Submit to Web3Forms (email delivery, no backend). */
async function submitToWeb3Forms(data: ContactFormData): Promise<SubmitResult> {
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: data.subject || `New portfolio message from ${data.name}`,
        from_name: 'sharadbhandari.com.np',
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json?.success) return { ok: true };
    return { ok: false, error: json?.message || 'Something went wrong. Please try again.' };
  } catch {
    return { ok: false, error: 'Network error. Please try WhatsApp or email instead.' };
  }
}

/** Submit the contact form through the first configured channel. */
export async function submitContact(data: ContactFormData): Promise<SubmitResult> {
  if (GOOGLE_SCRIPT_URL) return submitToGoogleSheet(data);
  if (WEB3FORMS_KEY) return submitToWeb3Forms(data);
  return { ok: false, error: 'Form delivery is not configured yet.' };
}

export const ContactService = {
  submitContact,
  buildWhatsAppLink,
  whatsAppFromForm,
  isFormConfigured,
};
