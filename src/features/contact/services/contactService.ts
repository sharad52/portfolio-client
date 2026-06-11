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

// ── Book a meeting ──────────────────────────────────────────────────
// Google Calendar address visitors are scheduled with (falls back to the
// site's contact email), and an optional public "appointment schedule" link.
const CALENDAR_EMAIL = (import.meta.env.VITE_CALENDAR_EMAIL as string) || profile.email;
const BOOKING_URL = import.meta.env.VITE_BOOKING_URL as string | undefined;

/**
 * Build a "schedule a meeting" link.
 *  - If a Google Calendar appointment-schedule URL is configured
 *    (profile.bookingUrl), use it — visitors book a real slot on your calendar.
 *  - Otherwise fall back to a Google Calendar event template that pre-invites
 *    your calendar address, so it works with zero setup.
 */
export function buildMeetingLink(): string {
  if (BOOKING_URL) return BOOKING_URL;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Meeting with ${profile.name}`,
    add: CALENDAR_EMAIL,
    details:
      'Requested via sharadbhandari.com.np — pick a time that works and send the invite. Looking forward to connecting!',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

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

interface ApproxLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
}

/**
 * Best-effort approximate location from the sender's IP — no permission prompt,
 * no extra form fields. Uses ipapi.co (free, keyless, HTTPS). Returns null on
 * any failure so submission proceeds without location.
 */
async function getApproxLocation(): Promise<ApproxLocation | null> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const j = await res.json();
    if (!j || j.error) return null;
    return {
      ip: j.ip || '',
      city: j.city || '',
      region: j.region || '',
      country: j.country_name || j.country || '',
    };
  } catch {
    return null;
  }
}

/** Human-readable "City, Region, Country" from an approximate location. */
function formatLocation(loc: ApproxLocation | null): string {
  if (!loc) return '';
  return [loc.city, loc.region, loc.country].filter(Boolean).join(', ');
}

/** Submit to a Google Apps Script web app (saves to a Sheet + emails you). */
async function submitToGoogleSheet(data: ContactFormData, loc: ApproxLocation | null): Promise<SubmitResult> {
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
        location: formatLocation(loc),
        ip: loc?.ip || '',
        source: 'sharadbhandari.com.np',
      }),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please try WhatsApp or email instead.' };
  }
}

/** Submit to Web3Forms (email delivery, no backend). */
async function submitToWeb3Forms(data: ContactFormData, loc: ApproxLocation | null): Promise<SubmitResult> {
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
        location: formatLocation(loc) || 'Unknown',
        ip: loc?.ip || '',
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
  // Resolve approximate location once, up front (best-effort, never blocks delivery).
  const loc = await getApproxLocation();
  if (GOOGLE_SCRIPT_URL) return submitToGoogleSheet(data, loc);
  if (WEB3FORMS_KEY) return submitToWeb3Forms(data, loc);
  return { ok: false, error: 'Form delivery is not configured yet.' };
}

export const ContactService = {
  submitContact,
  buildWhatsAppLink,
  whatsAppFromForm,
  buildMeetingLink,
  isFormConfigured,
};
