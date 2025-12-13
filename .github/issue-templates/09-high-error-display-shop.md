# [HIGH] Add error display and retry mechanism on shop page

**Labels**: `bug`, `high-priority`, `shop`, `ux`
**Priority**: 🟡 High

## Problem
Shop page silently handles errors without showing users what went wrong or providing a way to retry.

**Location**: `src/app/shop/ShopPage.tsx:39-41`

```typescript
catch (error) {
  // Error fetching products - silently handle in production
}
```

## Impact
- Users see empty state without knowing if it's an error or no products
- No way to retry failed requests
- Poor UX during network issues
- Users might think there are no products when it's just an error

## Current Behavior
```
[Loading...] → [Error occurs] → [Shows "محصولی یافت نشد"]
```
User thinks: "They have no products" ❌

## Expected Behavior
```
[Loading...] → [Error occurs] → [Shows error with retry button]
```
User thinks: "Network error, I can retry" ✅

## Proposed Solution

### 1. Add error state:
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### 2. Display error UI:
```typescript
if (error) {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>{error}</p>
      <button onClick={handleRetry} className={styles.retryButton}>
        تلاش مجدد
      </button>
    </div>
  );
}
```

### 3. Implement retry logic:
```typescript
const handleRetry = () => {
  setError(null);
  fetchProducts(filters);
};
```

### 4. Differentiate between error and empty:
```typescript
// Show "no products" only when successful fetch returns 0 items
// Show error message when request fails
```

## Acceptance Criteria
- [ ] Add error state to shop page
- [ ] Display error message when fetch fails
- [ ] Add retry button in error state
- [ ] Differentiate between "no products" and "error"
- [ ] Style error container consistently
- [ ] Test with network failure scenarios
- [ ] Test with 500 server errors
- [ ] Apply same pattern to category pages
- [ ] Consider adding error boundary

## Design Mockup
```
┌─────────────────────────────────────┐
│  ⚠️  خطا در بارگذاری محصولات       │
│                                     │
│  لطفا اتصال اینترنت خود را بررسی  │
│  کرده و مجددا تلاش کنید            │
│                                     │
│  [ 🔄 تلاش مجدد ]                  │
└─────────────────────────────────────┘
```

## Related Files
- `src/app/shop/ShopPage.tsx`
- `src/app/shop/shop.module.scss`
- `src/app/shop/category/[slug]/CategoryPage.tsx` (apply same pattern)
