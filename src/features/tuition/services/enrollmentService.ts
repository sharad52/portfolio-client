import { profile, courses, batches, intakes } from '@/content/site';
import { getApproxLocation, formatLocation, type ApproxLocation } from '@/shared/utils/location';
import { formatIsoDate } from '@/shared/utils/helpers';
import type { EnrollmentFormData } from '../types';

/**
 * ─────────────────────────────────────────────────────────────────
 *  Backend-free class enrolment (mirrors the contact flow)
 * ─────────────────────────────────────────────────────────────────
 *  On submit, an enrolment is delivered through the first configured
 *  channel, whichever is available:
 *    1. Google Apps Script → "Enrollments" sheet tab (+ email)
 *         [VITE_ENROLLMENT_SCRIPT_URL, falls back to VITE_GOOGLE_SCRIPT_URL]
 *    2. Web3Forms (email)                          [VITE_WEB3FORMS_KEY]
 *    3. WhatsApp deep link (always-available fallback)
 *
 *  No online payment is taken — you follow up to confirm the seat and
 *  arrange payment. Setup guide → docs/tuition-setup.md
 * ─────────────────────────────────────────────────────────────────
 */

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || profile.whatsapp;
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
// A dedicated enrolment endpoint if you want a separate sheet/deployment,
// otherwise reuse the same Apps Script the contact form posts to.
const ENROLLMENT_SCRIPT_URL =
  (import.meta.env.VITE_ENROLLMENT_SCRIPT_URL as string | undefined) ||
  (import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined);

export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Resolve human-readable course & batch labels from their ids. */
function resolveLabels(data: EnrollmentFormData): { course: string; batch: string } {
  const courseObj = courses.find((c) => c.slug === data.courseSlug);
  const slot = batches.find((b) => b.id === data.batchId);
  const course = courseObj?.title || data.courseSlug;
  // Every new enrolment is for the NEXT intake — the current one is already
  // mid-course. Prefixing the intake keeps the sheet/email unambiguous without
  // needing a new column in the Apps Script.
  const start = courseObj ? ` (starts ${formatIsoDate(courseObj.startDate, 'd MMM yyyy')})` : '';
  const intake = `${intakes.next.label} intake${start}`;
  // The slot gives the time; the course gives the days — combine into the full
  // schedule so the email / sheet records exactly when the class meets.
  const schedule = slot
    ? `${slot.label} — ${courseObj ? `${courseObj.days} · ` : ''}${slot.time}`
    : data.batchId;
  return { course, batch: `${intake} · ${schedule}` };
}

/** Compose a WhatsApp message from the enrolment form. */
export function whatsAppFromEnrollment(data: EnrollmentFormData): string {
  const { course, batch } = resolveLabels(data);
  const lines = [
    `Hi Sharad, I'd like to enrol in your Python tuition for the ${intakes.next.label} batch.`,
    '',
    `Course: ${course}`,
    `Batch: ${batch}`,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    data.currentLevel ? `Current level: ${data.currentLevel}` : '',
    data.goals ? `Goals: ${data.goals}` : '',
  ].filter(Boolean);
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return `${base}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** True if any email/sheet delivery channel is configured. */
export const isEnrollmentConfigured = (): boolean => Boolean(ENROLLMENT_SCRIPT_URL || WEB3FORMS_KEY);

/** Submit to a Google Apps Script web app (saves to the Enrollments tab + emails you). */
async function submitToGoogleSheet(data: EnrollmentFormData, loc: ApproxLocation | null): Promise<SubmitResult> {
  const { course, batch } = resolveLabels(data);
  try {
    // Apps Script web apps don't send CORS headers, so we POST as a "simple
    // request" (text/plain, no-cors). The response is opaque — reaching here
    // without a network error means the script ran. `type` lets one script
    // route contact vs. enrolment submissions to different sheet tabs.
    await fetch(ENROLLMENT_SCRIPT_URL!, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        type: 'enrollment',
        name: data.name,
        email: data.email,
        phone: data.phone,
        course,
        batch,
        level: data.currentLevel || '',
        goals: data.goals || '',
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
async function submitToWeb3Forms(data: EnrollmentFormData, loc: ApproxLocation | null): Promise<SubmitResult> {
  const { course, batch } = resolveLabels(data);
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New Python class enrolment: ${data.name} — ${course}`,
        from_name: 'sharadbhandari.com.np',
        name: data.name,
        email: data.email,
        phone: data.phone,
        course,
        batch,
        level: data.currentLevel || '',
        message: data.goals || '(no goals provided)',
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

/** Submit an enrolment through the first configured channel. */
export async function submitEnrollment(data: EnrollmentFormData): Promise<SubmitResult> {
  const loc = await getApproxLocation();
  if (ENROLLMENT_SCRIPT_URL) return submitToGoogleSheet(data, loc);
  if (WEB3FORMS_KEY) return submitToWeb3Forms(data, loc);
  return { ok: false, error: 'Enrolment delivery is not configured yet.' };
}

export const EnrollmentService = {
  submitEnrollment,
  whatsAppFromEnrollment,
  isEnrollmentConfigured,
};
