# [HIGH] Fix image loading state issues on product details page

**Labels**: `bug`, `high-priority`, `shop`, `ux`
**Priority**: 🟡 High

## Problem
The image loading state on product details page has several issues that can cause stuck loading states.

**Location**: `src/app/shop/[slug]/ProductDetailsPage.tsx:111-121`

### Issues:
1. Loading state is set but only cleared on successful load
2. No timeout for failed image loads
3. Skeleton overlay z-index might conflict with actual image
4. Loading state doesn't reset when changing images fails

## Impact
- Users see stuck loading skeleton if image fails
- Poor UX when images don't load
- No fallback for broken images
- Loading overlay persists indefinitely

## Proposed Solution

### 1. Add timeout for image loading:
```typescript
const [imageLoadTimeout, setImageLoadTimeout] = useState<NodeJS.Timeout | null>(null);

const handleImageSelect = (image: string) => {
  if (image === selectedImage) return;

  setIsImageLoading(true);
  setSelectedImage(image);

  // Set timeout to clear loading state after 5 seconds
  const timeout = setTimeout(() => {
    setIsImageLoading(false);
  }, 5000);

  setImageLoadTimeout(timeout);
};

const handleImageLoadComplete = () => {
  setIsImageLoading(false);
  if (imageLoadTimeout) {
    clearTimeout(imageLoadTimeout);
  }
};
```

### 2. Add error handler for images:
```typescript
<Image
  src={selectedImage}
  alt={product.title}
  onLoad={handleImageLoadComplete}
  onError={handleImageError} // Add this
  // ...
/>
```

### 3. Provide fallback UI for failed images:
```typescript
const handleImageError = () => {
  setIsImageLoading(false);
  setImageLoadFailed(true);
  // Show placeholder or error message
};
```

## Acceptance Criteria
- [ ] Add timeout for image loading (5 seconds)
- [ ] Implement onError handler for images
- [ ] Show fallback UI when image fails to load
- [ ] Clear timeout on successful load
- [ ] Test with slow network (throttling)
- [ ] Test with broken image URLs
- [ ] Ensure skeleton properly removed in all cases
- [ ] Add loading state for thumbnail clicks

## Related Files
- `src/app/shop/[slug]/ProductDetailsPage.tsx`
- `src/app/shop/[slug]/productDetails.module.scss`
