/**
 * Single source of truth for environment-driven site configuration.
 * Imported by layout, robots, sitemap and the quotation API.
 */

/**
 * Canonical origin used in sitemap.xml, robots.txt, Open Graph and JSON-LD.
 *
 * IMPORTANT (Google Search Console):
 * Sitemap <loc> hosts must match the property where the sitemap is submitted.
 * - URL-prefix property https://elsimengineeringlimited.com  → use this apex host
 * - URL-prefix property https://www.elsimengineeringlimited.com → set
 *   NEXT_PUBLIC_SITE_URL=https://www.elsimengineeringlimited.com in Pages env
 * - Never submit a pages.dev sitemap that lists custom-domain URLs (or the reverse)
 *
 * No trailing slash.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elsimengineeringlimited.com'
).replace(/\/$/, '');

/**
 * Search-engine indexing.
 *
 * The site previously shipped with a hard `disallow: /` and `noindex` while it
 * was pre-launch. That is now a switch rather than a fact: set
 * NEXT_PUBLIC_SITE_INDEXABLE=false to put the block back during staging.
 */
export const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false';

/** Google Analytics measurement ID. Empty string disables analytics entirely. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-E8Z0XCC54Q';

/**
 * True when the build targets a fully static export (Cloudflare Pages).
 * Route handlers do not exist in that output, so client code uses this to
 * choose a non-API submission path.
 */
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

/**
 * Where quotation submissions are emailed.
 * Override with QUOTATION_INBOX in the host environment if needed.
 * Mail to support@elsimengineeringlimited.com should be forwarded at the domain
 * provider to elsimengineering@gmail.com.
 */
export const quotationInbox =
  process.env.QUOTATION_INBOX ?? 'support@elsimengineeringlimited.com';
