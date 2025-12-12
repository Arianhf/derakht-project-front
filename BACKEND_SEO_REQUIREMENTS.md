# Backend API Requirements for Blog SEO Improvements

## Document Overview
This document outlines the required backend API changes to support comprehensive SEO optimization for the Derakht blog platform.

---

## 1. Blog Post Model - Required New Fields

### Critical Priority (Required for Basic SEO)

#### `slug` (string, required, unique)
- **Purpose**: URL-friendly identifier for blog posts
- **Format**: Lowercase, hyphen-separated (e.g., "best-kids-story-2024")
- **Requirements**:
  - Must be unique across all posts
  - Auto-generate from title if not provided
  - Should be editable by admin
  - Only allow: lowercase letters, numbers, hyphens
- **Example**: `"slug": "آموزش-ریاضی-کودکان"`

#### `meta_description` (string, required)
- **Purpose**: Description shown in search engine results
- **Format**: Plain text
- **Requirements**:
  - 150-160 characters recommended
  - Must be unique for each post
  - Should summarize the post content compellingly
- **Example**: `"meta_description": "آموزش ریاضی به کودکان با روش‌های سرگرم‌کننده و بازی‌های تعاملی. مناسب برای سنین ۶ تا ۱۲ سال"`

#### `published_date` (string, required)
- **Purpose**: ISO 8601 format timestamp for SEO and schema markup
- **Format**: ISO 8601 DateTime (UTC)
- **Requirements**:
  - Keep existing `jalali_date` for display
  - Add this field for technical/SEO purposes
- **Example**: `"published_date": "2024-01-15T10:30:00Z"`

#### `excerpt` (string, required)
- **Purpose**: Short summary separate from `intro` field
- **Format**: Plain text, 2-3 sentences
- **Requirements**:
  - 150-200 characters
  - Different from `meta_description` (more conversational)
  - Used for post previews and social sharing
- **Example**: `"excerpt": "در این مقاله با روش‌های جذاب آموزش ریاضی به کودکان آشنا می‌شوید که یادگیری را برای آن‌ها لذت‌بخش می‌کند."`

---

### High Priority (Important for Rich SEO)

#### `updated_date` (string, optional)
- **Purpose**: Track last modification for search engines
- **Format**: ISO 8601 DateTime (UTC)
- **Requirements**:
  - Update automatically when post is edited
  - Only include if post has been modified after initial publication
- **Example**: `"updated_date": "2024-02-20T15:45:00Z"`

#### `meta_title` (string, optional)
- **Purpose**: Custom SEO title (if different from main title)
- **Format**: Plain text
- **Requirements**:
  - 50-60 characters recommended
  - Falls back to `title` if not provided
  - Include target keywords
- **Example**: `"meta_title": "آموزش ریاضی به کودکان | بهترین روش‌های یادگیری 2024"`

#### `word_count` (integer, optional)
- **Purpose**: Display reading metrics and content quality signals
- **Format**: Positive integer
- **Requirements**: Auto-calculate from `body` content
- **Example**: `"word_count": 1250`

#### Enhanced `author` object
Current structure:
```json
{
  "first_name": "string",
  "last_name": "string",
  "age": 0,
  "profile_image": "string"
}
```

**Add these fields:**
```json
{
  "id": "string|number",  // Required: Author unique identifier
  "first_name": "string",
  "last_name": "string",
  "full_name": "string",  // Required: Combined name
  "bio": "string",  // Optional: Short author biography (100-200 chars)
  "profile_url": "string",  // Optional: URL to author's profile page
  "profile_image": "string",
  "email": "string",  // Optional: For schema.org markup
  "social_links": {  // Optional
    "twitter": "string",
    "linkedin": "string",
    "instagram": "string"
  }
}
```

**Example:**
```json
"owner": {
  "id": "123",
  "first_name": "سارا",
  "last_name": "محمدی",
  "full_name": "سارا محمدی",
  "bio": "نویسنده و مربی کودک با ۱۰ سال تجربه در آموزش خلاقانه",
  "profile_url": "/authors/sara-mohammadi",
  "profile_image": "https://...",
  "email": "sara@example.com",
  "social_links": {
    "twitter": "https://twitter.com/sara_mohammadi",
    "instagram": "https://instagram.com/sara_mohammadi"
  }
}
```

#### Enhanced `category` field
Current: Category is returned as a slug in query params

**Change to full object:**
```json
"category": {
  "id": "string|number",
  "name": "string",
  "slug": "string",
  "description": "string",
  "icon": "string"
}
```

**Example:**
```json
"category": {
  "id": "5",
  "name": "آموزش ریاضی",
  "slug": "math-education",
  "description": "مقالات آموزشی ریاضی برای کودکان",
  "icon": "https://..."
}
```

---

### Medium Priority (Recommended for Advanced SEO)

#### `canonical_url` (string, optional)
- **Purpose**: Specify preferred URL if content exists elsewhere or has multiple URLs
- **Format**: Full absolute URL
- **Example**: `"canonical_url": "https://derakht.com/blog/آموزش-ریاضی-کودکان"`

#### `meta_keywords` (array of strings, optional)
- **Purpose**: Focus keywords for the post
- **Format**: Array of keyword strings
- **Requirements**: 3-5 keywords max
- **Example**: `"meta_keywords": ["آموزش ریاضی", "کودکان", "بازی آموزشی", "ریاضی سرگرم‌کننده"]`

#### `og_image` (string, optional)
- **Purpose**: Specific image for social media sharing (different from header_image if needed)
- **Format**: URL to image
- **Requirements**:
  - 1200x630px recommended
  - Falls back to `header_image` if not provided
- **Example**: `"og_image": "https://derakht-storage.darkube.app/og-images/math-post.jpg"`

#### `featured_snippet` (string, optional)
- **Purpose**: Optimized content for Google featured snippets
- **Format**: Plain text or simple HTML
- **Requirements**: Concise answer (40-60 words) to a question the post answers
- **Example**: `"featured_snippet": "بهترین روش آموزش ریاضی به کودکان استفاده از بازی‌های آموزشی است که مفاهیم ریاضی را به صورت تعاملی و سرگرم‌کننده آموزش می‌دهند."`

#### `noindex` (boolean, optional, default: false)
- **Purpose**: Tell search engines not to index this post
- **Use case**: Draft posts, test content, temporary posts
- **Example**: `"noindex": false`

---

## 2. Category Model - Required New Fields

### Current fields
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "icon": "string",
  "post_count": 0
}
```

### Add these fields:

#### `meta_title` (string, optional)
- **Purpose**: SEO title for category page
- **Format**: Plain text, 50-60 characters
- **Example**: `"meta_title": "مقالات آموزش ریاضی برای کودکان | درخت"`

#### `meta_description` (string, required)
- **Purpose**: Description for category page in search results
- **Format**: Plain text, 150-160 characters
- **Example**: `"meta_description": "مجموعه کامل مقالات آموزش ریاضی برای کودکان با روش‌های سرگرم‌کننده و مؤثر"`

---

## 3. API Endpoint Changes

### 3.1 Individual Post Endpoint
**Current:** `GET blog/posts/{id}/`

**Required Change:** Support slug-based retrieval
- `GET blog/posts/{slug}/` should work with slug parameter
- Keep supporting numeric ID for backward compatibility
- Auto-detect if parameter is numeric (ID) or string (slug)

**Example requests:**
```
GET blog/posts/123/  (ID - keep working)
GET blog/posts/آموزش-ریاضی-کودکان/  (slug - add support)
```

### 3.2 Posts List Endpoint
**Current:** `GET blog/posts/`

**Enhancement:** Return complete response structure with all new fields

**Example response:**
```json
{
  "items": [
    {
      "id": 1,
      "slug": "آموزش-ریاضی-کودکان",
      "title": "آموزش ریاضی به کودکان",
      "subtitle": "روش‌های جذاب و سرگرم‌کننده",
      "intro": "...",
      "excerpt": "...",
      "meta_title": "آموزش ریاضی به کودکان | بهترین روش‌های یادگیری 2024",
      "meta_description": "...",
      "body": "...",
      "header_image": {
        "meta": {
          "download_url": "https://..."
        },
        "title": "..."
      },
      "category": {
        "id": "5",
        "name": "آموزش ریاضی",
        "slug": "math-education",
        "description": "..."
      },
      "owner": {
        "id": "123",
        "first_name": "سارا",
        "last_name": "محمدی",
        "full_name": "سارا محمدی",
        "bio": "...",
        "profile_url": "/authors/sara-mohammadi",
        "profile_image": "...",
        "email": "sara@example.com"
      },
      "tags": ["آموزش ریاضی", "کودکان"],
      "jalali_date": "۱۴۰۳/۱۰/۲۵",
      "published_date": "2024-01-15T10:30:00Z",
      "updated_date": "2024-02-20T15:45:00Z",
      "reading_time": 8,
      "word_count": 1250,
      "featured": true,
      "hero": false,
      "alternative_titles": []
    }
  ],
  "total": 50,
  "page": 1,
  "size": 10
}
```

### 3.3 New Endpoint: Get All Post Slugs
**Purpose:** For sitemap generation

**Endpoint:** `GET blog/posts/slugs/`

**Response:**
```json
{
  "items": [
    {
      "slug": "آموزش-ریاضی-کودکان",
      "updated_date": "2024-02-20T15:45:00Z"
    },
    {
      "slug": "داستان-کودکان",
      "updated_date": "2024-01-10T08:20:00Z"
    }
  ],
  "total": 50
}
```

**Requirements:**
- Return all published posts (not drafts)
- Include `slug` and `updated_date` (or `published_date` if no update)
- No pagination needed (return all at once)
- Should be fast (only 2 fields)

### 3.4 Categories Endpoint Enhancement
**Current:** `GET blog/categories/`

**Enhancement:** Include meta fields in response

**Example response:**
```json
{
  "items": [
    {
      "id": "5",
      "name": "آموزش ریاضی",
      "slug": "math-education",
      "description": "مقالات آموزشی ریاضی برای کودکان",
      "meta_title": "مقالات آموزش ریاضی برای کودکان | درخت",
      "meta_description": "مجموعه کامل مقالات آموزش ریاضی",
      "icon": "https://...",
      "post_count": 15
    }
  ],
  "total": 8,
  "page": 1,
  "size": 20
}
```

---

## 4. Data Validation Rules

### Slug Generation Rules
If admin doesn't provide a custom slug, auto-generate from title:
1. Convert to lowercase
2. Replace spaces with hyphens
3. Remove special characters (except hyphens)
4. For Persian: keep Persian characters
5. Ensure uniqueness (append number if needed: `title-2`, `title-3`)

**Example:**
- Title: "آموزش ریاضی برای کودکان 2024"
- Auto-slug: `"آموزش-ریاضی-برای-کودکان-2024"`

### Meta Description Validation
- Required field (cannot be empty)
- Minimum length: 120 characters
- Maximum length: 160 characters
- Return validation error if not provided

### Date Format
All date fields must be in ISO 8601 format with UTC timezone:
- Format: `YYYY-MM-DDTHH:mm:ssZ`
- Example: `2024-01-15T10:30:00Z`

---

## 5. Database Migration Considerations

### Required Migrations
1. Add new columns to posts table:
   - `slug` (VARCHAR, UNIQUE, INDEXED)
   - `meta_title` (VARCHAR, nullable)
   - `meta_description` (TEXT)
   - `published_date` (DATETIME)
   - `updated_date` (DATETIME, nullable)
   - `excerpt` (TEXT)
   - `word_count` (INTEGER, nullable)
   - `canonical_url` (VARCHAR, nullable)
   - `og_image` (VARCHAR, nullable)
   - `noindex` (BOOLEAN, default: false)

2. Generate slugs for existing posts:
   - Run script to auto-generate slugs from existing titles
   - Handle duplicates

3. Add meta fields to categories table:
   - `meta_title` (VARCHAR, nullable)
   - `meta_description` (TEXT)

4. Enhance author/user table (if needed):
   - `bio` (TEXT, nullable)
   - `profile_url` (VARCHAR, nullable)
   - Ensure `full_name` or ability to combine first_name + last_name

---

## 6. Priority Summary

### Phase 1: Critical (Required for launch)
- [ ] Add `slug` field to posts
- [ ] Add `meta_description` field to posts
- [ ] Add `published_date` field to posts
- [ ] Add `excerpt` field to posts
- [ ] Support slug-based post retrieval (GET blog/posts/{slug}/)
- [ ] Create slugs endpoint for sitemap (GET blog/posts/slugs/)

### Phase 2: High Priority (Within 1-2 weeks)
- [ ] Add `updated_date` field to posts
- [ ] Add `meta_title` field to posts
- [ ] Enhance `author` object with full data
- [ ] Return full `category` object in posts (not just slug)
- [ ] Add `word_count` auto-calculation
- [ ] Add meta fields to categories

### Phase 3: Medium Priority (Nice to have)
- [ ] Add `canonical_url` field
- [ ] Add `og_image` field
- [ ] Add `meta_keywords` field
- [ ] Add `noindex` field
- [ ] Add `featured_snippet` field

---

## 7. Testing Checklist

Before marking as complete, test:
- [ ] Create new post with all new fields
- [ ] Retrieve post by ID (backward compatibility)
- [ ] Retrieve post by slug (new feature)
- [ ] Auto-slug generation works correctly
- [ ] Slug uniqueness is enforced
- [ ] Updated_date auto-updates on post edit
- [ ] Word count auto-calculates from body
- [ ] All new fields appear in API responses
- [ ] Slugs endpoint returns all posts quickly
- [ ] Category meta fields return correctly
- [ ] Enhanced author object returns in posts

---

## 8. Example Complete Post Response

Here's what a complete post response should look like with all fields:

```json
{
  "id": 1,
  "slug": "آموزش-ریاضی-کودکان",
  "title": "آموزش ریاضی به کودکان",
  "subtitle": "روش‌های جذاب و سرگرم‌کننده",
  "intro": "ریاضی یکی از مهم‌ترین مهارت‌های زندگی است که باید از کودکی آموزش داده شود.",
  "excerpt": "در این مقاله با روش‌های جذاب آموزش ریاضی به کودکان آشنا می‌شوید که یادگیری را برای آن‌ها لذت‌بخش می‌کند.",
  "meta_title": "آموزش ریاضی به کودکان | بهترین روش‌های یادگیری 2024",
  "meta_description": "آموزش ریاضی به کودکان با روش‌های سرگرم‌کننده و بازی‌های تعاملی. مناسب برای سنین ۶ تا ۱۲ سال",
  "meta_keywords": ["آموزش ریاضی", "کودکان", "بازی آموزشی"],
  "body": "<p>محتوای کامل مقاله...</p>",
  "header_image": {
    "meta": {
      "download_url": "https://derakht-storage.darkube.app/images/math-kids.jpg"
    },
    "title": "کودکان در حال یادگیری ریاضی"
  },
  "og_image": "https://derakht-storage.darkube.app/og-images/math-kids-og.jpg",
  "category": {
    "id": "5",
    "name": "آموزش ریاضی",
    "slug": "math-education",
    "description": "مقالات آموزشی ریاضی برای کودکان",
    "icon": "https://...",
    "meta_title": "مقالات آموزش ریاضی برای کودکان | درخت",
    "meta_description": "مجموعه کامل مقالات آموزش ریاضی"
  },
  "owner": {
    "id": "123",
    "first_name": "سارا",
    "last_name": "محمدی",
    "full_name": "سارا محمدی",
    "bio": "نویسنده و مربی کودک با ۱۰ سال تجربه در آموزش خلاقانه",
    "profile_url": "/authors/sara-mohammadi",
    "profile_image": "https://derakht-storage.darkube.app/authors/sara.jpg",
    "email": "sara@example.com",
    "age": 35,
    "social_links": {
      "twitter": "https://twitter.com/sara_mohammadi",
      "instagram": "https://instagram.com/sara_mohammadi"
    }
  },
  "tags": ["آموزش ریاضی", "کودکان", "بازی آموزشی", "ریاضی سرگرم‌کننده"],
  "jalali_date": "۱۴۰۳/۱۰/۲۵",
  "published_date": "2024-01-15T10:30:00Z",
  "updated_date": "2024-02-20T15:45:00Z",
  "reading_time": 8,
  "word_count": 1250,
  "featured": true,
  "hero": false,
  "alternative_titles": ["ریاضی برای کودکان", "آموزش عددها به بچه‌ها"],
  "canonical_url": "https://derakht.com/blog/آموزش-ریاضی-کودکان",
  "noindex": false
}
```

---

## 9. Questions for Backend Team

Please clarify:
1. What is your preferred slug generation approach? (Auto from title or require manual input?)
2. Do you use PostgreSQL, MySQL, or other database? (May affect slug indexing strategy)
3. Can you auto-calculate `word_count` from `body` field?
4. Is there an existing author/user profile system we can extend?
5. What's your timeline for Phase 1 (critical) vs Phase 2 (high priority)?
6. Do you use any CMS/admin panel where these new fields need to be added?

---

## 10. Contact & Coordination

- **Frontend Lead**: [Your Name]
- **Document Version**: 1.0
- **Date**: 2025-11-02
- **Priority**: High - SEO is critical for organic traffic

Please review this document and provide:
1. Timeline estimate for each phase
2. Any technical constraints or concerns
3. Questions or clarifications needed
4. Suggested modifications to the proposal

Once Phase 1 is complete, the frontend team can begin implementing dynamic metadata, structured data, and sitemap generation.
