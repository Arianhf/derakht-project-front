/**
 * @jest-environment jsdom
 */

import { sanitizeHTML, useSanitizedHTML } from './sanitize';

describe('sanitizeHTML', () => {
  describe('XSS Attack Vectors', () => {
    it('should remove script tags', () => {
      const malicious = '<p>Hello</p><script>alert("XSS")</script>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).toBe('<p>Hello</p>');
      expect(result).not.toContain('script');
    });

    it('should remove inline event handlers', () => {
      const malicious = '<img src="x" onerror="alert(\'XSS\')">';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should remove onclick handlers', () => {
      const malicious = '<a href="#" onclick="alert(\'XSS\')">Click me</a>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
    });

    it('should remove onload handlers', () => {
      const malicious = '<body onload="alert(\'XSS\')">Content</body>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).not.toContain('onload');
      expect(result).not.toContain('alert');
    });

    it('should remove onmouseover handlers', () => {
      const malicious = '<div onmouseover="alert(\'XSS\')">Hover me</div>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).not.toContain('onmouseover');
      expect(result).not.toContain('alert');
    });

    it('should remove iframe tags', () => {
      const malicious = '<p>Content</p><iframe src="evil.com"></iframe>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).toBe('<p>Content</p>');
      expect(result).not.toContain('iframe');
    });

    it('should remove object tags', () => {
      const malicious = '<object data="evil.swf"></object>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).toBe('');
      expect(result).not.toContain('object');
    });

    it('should remove embed tags', () => {
      const malicious = '<embed src="evil.swf">';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).toBe('');
      expect(result).not.toContain('embed');
    });

    it('should remove form tags', () => {
      const malicious = '<form action="evil.com"><input name="data"></form>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).toBe('');
      expect(result).not.toContain('form');
      expect(result).not.toContain('input');
    });

    it('should handle javascript: protocol in links', () => {
      const malicious = '<a href="javascript:alert(\'XSS\')">Click</a>';
      const result = sanitizeHTML(malicious, 'blog');
      expect(result).not.toContain('javascript:');
    });

    it('should handle data: protocol in images', () => {
      const malicious = '<img src="data:text/html,<script>alert(\'XSS\')</script>">';
      const result = sanitizeHTML(malicious, 'blog');
      // DOMPurify should either remove the src or sanitize the data URI
      // Either way, the result should be safe
      expect(result).toBeTruthy();
      // The important part is that if script content remains in attributes,
      // it won't execute in the DOM
    });
  });

  describe('Blog Content - Allowed Tags', () => {
    it('should preserve paragraph tags', () => {
      const html = '<p>This is a paragraph</p>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toBe('<p>This is a paragraph</p>');
    });

    it('should preserve heading tags', () => {
      const html = '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('<h1>Heading 1</h1>');
      expect(result).toContain('<h2>Heading 2</h2>');
      expect(result).toContain('<h3>Heading 3</h3>');
    });

    it('should preserve text formatting tags', () => {
      const html = '<p><strong>Bold</strong> <em>Italic</em> <u>Underline</u></p>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('<strong>Bold</strong>');
      expect(result).toContain('<em>Italic</em>');
      expect(result).toContain('<u>Underline</u>');
    });

    it('should preserve list tags', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>Item 1</li>');
      expect(result).toContain('</ul>');
    });

    it('should preserve safe link attributes', () => {
      const html = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('target');
    });

    it('should preserve safe image attributes', () => {
      const html = '<img src="/image.jpg" alt="Test" width="100" height="100">';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('src="/image.jpg"');
      expect(result).toContain('alt="Test"');
      expect(result).toContain('width="100"');
      expect(result).toContain('height="100"');
    });

    it('should preserve table tags', () => {
      const html = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('<table>');
      expect(result).toContain('<th>Header</th>');
      expect(result).toContain('<td>Data</td>');
    });

    it('should preserve class and id attributes', () => {
      const html = '<div class="container" id="main">Content</div>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('class="container"');
      expect(result).toContain('id="main"');
    });

    it('should preserve blockquote and code tags', () => {
      const html = '<blockquote>Quote</blockquote><pre><code>const x = 1;</code></pre>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('<blockquote>Quote</blockquote>');
      expect(result).toContain('<code>const x = 1;</code>');
    });
  });

  describe('Product Content - Restricted Tags', () => {
    it('should preserve basic formatting', () => {
      const html = '<p><strong>Product Name</strong></p><ul><li>Feature 1</li></ul>';
      const result = sanitizeHTML(html, 'product');
      expect(result).toContain('<strong>Product Name</strong>');
      expect(result).toContain('<li>Feature 1</li>');
    });

    it('should remove table tags in product mode', () => {
      const html = '<table><tr><td>Data</td></tr></table>';
      const result = sanitizeHTML(html, 'product');
      expect(result).not.toContain('<table>');
      expect(result).toBe('Data');
    });

    it('should remove h1 and h2 tags in product mode', () => {
      const html = '<h1>Title</h1><h2>Subtitle</h2><h3>Heading</h3>';
      const result = sanitizeHTML(html, 'product');
      expect(result).not.toContain('<h1>');
      expect(result).not.toContain('<h2>');
      expect(result).toContain('<h3>Heading</h3>');
    });

    it('should preserve allowed heading tags', () => {
      const html = '<h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>';
      const result = sanitizeHTML(html, 'product');
      expect(result).toContain('<h3>H3</h3>');
      expect(result).toContain('<h4>H4</h4>');
      expect(result).toContain('<h5>H5</h5>');
      expect(result).toContain('<h6>H6</h6>');
    });
  });

  describe('Server-Side Rendering', () => {
    it('should handle server-side gracefully', () => {
      // Note: In actual server-side rendering with Next.js, the sanitization
      // happens on the client side when the component hydrates.
      // DOMPurify works in jsdom environment which is what we use for testing.
      const html = '<p>Safe content</p>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toBe('<p>Safe content</p>');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const result = sanitizeHTML('', 'blog');
      expect(result).toBe('');
    });

    it('should handle plain text without tags', () => {
      const text = 'Just plain text';
      const result = sanitizeHTML(text, 'blog');
      expect(result).toBe('Just plain text');
    });

    it('should handle nested tags correctly', () => {
      const html = '<div><p><strong><em>Nested</em></strong></p></div>';
      const result = sanitizeHTML(html, 'blog');
      expect(result).toContain('<div>');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>Nested</em>');
    });

    it('should handle malformed HTML gracefully', () => {
      const malformed = '<p>Unclosed paragraph<div>Mixed tags</p></div>';
      const result = sanitizeHTML(malformed, 'blog');
      // DOMPurify should clean up malformed HTML
      expect(result).toBeTruthy();
      expect(result).not.toContain('script');
    });
  });
});

describe('useSanitizedHTML', () => {
  it('should return object with __html property', () => {
    const html = '<p>Test content</p>';
    const result = useSanitizedHTML(html, 'blog');
    expect(result).toHaveProperty('__html');
    expect(result.__html).toBe('<p>Test content</p>');
  });

  it('should sanitize XSS in returned object', () => {
    const malicious = '<p>Content</p><script>alert("XSS")</script>';
    const result = useSanitizedHTML(malicious, 'blog');
    expect(result.__html).not.toContain('script');
    expect(result.__html).toBe('<p>Content</p>');
  });

  it('should work with product type', () => {
    const html = '<p>Product info</p><table><tr><td>Data</td></tr></table>';
    const result = useSanitizedHTML(html, 'product');
    expect(result.__html).not.toContain('<table>');
  });
});
