// Application constants

export const APP_NAME = 'Developer Portfolio';
export const APP_VERSION = '2.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

// Social media links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/sharad52',
  LINKEDIN: 'https://linkedin.com/in/sharad52',
  TWITTER: 'https://twitter.com/yourusername',
  EMAIL: 'mailto:ersharadbhandari@gmail.com',
} as const;

// API endpoints are now in services, not here

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// File upload limits (if implementing file uploads)
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

// Cache durations (in seconds)
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;
