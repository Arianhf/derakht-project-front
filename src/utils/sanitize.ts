import DOMPurify from 'dompurify';

/**
 * Configuration for DOMPurify sanitization
 * Allows safe HTML tags and attributes while blocking XSS vectors
 */

// Type for DOMPurify configuration
type SanitizeConfig = {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ADD_ATTR?: string[];
  FORBID_TAGS?: string[];
  FORBID_ATTR?: string[];
};

// Blog content configuration - allows rich HTML formatting
const BLOG_CONFIG: SanitizeConfig = {
  ALLOWED_TAGS: [
    // Text formatting
    'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Lists
    'ul', 'ol', 'li',
    // Links and images
    'a', 'img',
    // Tables
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    // Semantic elements
    'blockquote', 'pre', 'code', 'div', 'span',
  ],
  ALLOWED_ATTR: [
    // For links
    'href', 'target', 'rel',
    // For images
    'src', 'alt', 'title', 'width', 'height',
    // For styling (class and id for CMS-generated content)
    'class', 'id',
    // For tables
    'colspan', 'rowspan',
  ],
  // Enforce that links have rel="noopener noreferrer" for security
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

// Product description configuration - more restrictive
const PRODUCT_CONFIG: SanitizeConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i',
    'ul', 'ol', 'li',
    'h3', 'h4', 'h5', 'h6', // No h1/h2 in product descriptions
    'a', 'img',
    'div', 'span',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'title', 'width', 'height',
    'class',
  ],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'table'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @param type - The type of content ('blog' or 'product')
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(
  html: string,
  type: 'blog' | 'product' = 'blog'
): string {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (sanitization happens client-side)
    return html;
  }

  const config = type === 'blog' ? BLOG_CONFIG : PRODUCT_CONFIG;
  return DOMPurify.sanitize(html, config);
}

/**
 * React hook for sanitizing HTML content
 * @param html - The HTML string to sanitize
 * @param type - The type of content ('blog' or 'product')
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export function useSanitizedHTML(
  html: string,
  type: 'blog' | 'product' = 'blog'
): { __html: string } {
  return {
    __html: sanitizeHTML(html, type),
  };
}
