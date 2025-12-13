# [LOW] Improve accessibility across shop and checkout flow

**Labels**: `enhancement`, `low-priority`, `a11y`, `accessibility`
**Priority**: 🟢 Low

## Problem
Multiple accessibility issues found across the shop and checkout pages:
- Missing ARIA labels on interactive elements
- No keyboard navigation for image galleries
- Insufficient color contrast in some areas
- No screen reader announcements for cart updates

## Impact
- Users with disabilities have poor experience
- Not compliant with WCAG 2.1 AA standards
- Potential legal issues
- Excludes portion of user base

## Issues Found

### 1. Missing ARIA Labels
**Locations**: Throughout shop flow

```tsx
// Before (no label)
<button onClick={handleAddToCart}>
  <FaShoppingCart />
</button>

// After (with label)
<button
  onClick={handleAddToCart}
  aria-label="افزودن به سبد خرید"
>
  <FaShoppingCart />
</button>
```

### 2. No Keyboard Navigation for Image Gallery
**Location**: `src/app/shop/[slug]/ProductDetailsPage.tsx`

Add keyboard handlers:
```tsx
<div
  className={styles.thumbnail}
  onClick={() => handleImageSelect(image.image_url)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleImageSelect(image.image_url);
    }
  }}
  tabIndex={0}
  role="button"
  aria-label={`تصویر ${index + 1} از ${product.images.length}`}
>
```

### 3. No Screen Reader Announcements
**Location**: Cart operations

Add live region for announcements:
```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className={styles.srOnly}
>
  {cartMessage}
</div>

// CSS
.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 4. Form Labels Missing
**Location**: Checkout forms

```tsx
// Ensure all inputs have labels
<label htmlFor="phoneNumber">
  شماره تماس *
  <input
    id="phoneNumber"
    type="tel"
    aria-required="true"
    aria-invalid={errors.phoneNumber ? 'true' : 'false'}
    aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
  />
</label>
{errors.phoneNumber && (
  <span id="phoneNumber-error" role="alert">
    {errors.phoneNumber}
  </span>
)}
```

### 5. Color Contrast Issues
Run contrast checker on:
- Button text vs background
- Link colors
- Error messages
- Badges

Minimum ratios:
- Normal text: 4.5:1
- Large text: 3:1

### 6. Focus Indicators
Ensure visible focus:
```scss
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid $primary-color;
  outline-offset: 2px;
}
```

## Acceptance Criteria

### General
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible and clear
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader tested (NVDA/JAWS)

### Shop Page
- [ ] Product cards keyboard accessible
- [ ] Filter controls have labels
- [ ] Search has proper label
- [ ] Grid has proper structure

### Product Details
- [ ] Image gallery keyboard navigable
- [ ] Add to cart announces changes
- [ ] Quantity controls accessible
- [ ] Comments form accessible (if kept)

### Cart
- [ ] Cart updates announced
- [ ] Quantity controls keyboard accessible
- [ ] Remove buttons have clear labels
- [ ] Empty state accessible

### Checkout
- [ ] All form fields labeled
- [ ] Error messages associated with inputs
- [ ] Step indicators keyboard navigable
- [ ] Required fields marked
- [ ] Payment options keyboard selectable

### Order Confirmation
- [ ] Order details accessible
- [ ] Actions keyboard accessible
- [ ] Print function accessible

## Testing Tools
- [ ] [axe DevTools](https://www.deque.com/axe/devtools/)
- [ ] [WAVE](https://wave.webaim.org/)
- [ ] Lighthouse accessibility audit
- [ ] Keyboard-only navigation
- [ ] NVDA screen reader (Windows)
- [ ] VoiceOver (Mac/iOS)

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility](https://react.dev/learn/accessibility)

## Related Files
All shop and checkout components should be reviewed and updated.

## Priority Note
While marked as low priority for business, this is important for:
- Legal compliance
- Inclusive design
- Better UX for all users
- SEO benefits

Consider increasing priority if:
- Government compliance required
- B2B customers need it
- Accessibility lawsuits common in your region
