/**
 * Best-effort approximate visitor location from their IP — no permission
 * prompt, no extra form fields. Shared by the contact and tuition-enrolment
 * flows so both can attach a city-level location to submissions.
 *
 * Uses ipapi.co (free, keyless, HTTPS). Every call is best-effort and returns
 * null on any failure, so submission always proceeds without location.
 */

export interface ApproxLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
}

/** Resolve an approximate location from the sender's IP, or null on failure. */
export async function getApproxLocation(): Promise<ApproxLocation | null> {
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
export function formatLocation(loc: ApproxLocation | null): string {
  if (!loc) return '';
  return [loc.city, loc.region, loc.country].filter(Boolean).join(', ');
}
