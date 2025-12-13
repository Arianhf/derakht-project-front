# [HIGH] Add loading indicators for cart operations

**Labels**: `enhancement`, `high-priority`, `cart`, `ux`
**Priority**: 🟡 High

## Problem
Cart page doesn't show loading indicators when users increase/decrease quantities, leading to users clicking multiple times.

**Location**: `src/app/cart/page.tsx:90-99`

```typescript
onClick={(e) => {
  e.preventDefault();
  increaseQuantity(item.product.id); // No visual feedback
}}
```

## Impact
- Users don't know if their action registered
- Multiple clicks send duplicate requests
- Poor perceived performance
- Confusion during slow network conditions

## Proposed Solution

### 1. Add per-item loading state:
```typescript
const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

const handleIncrease = async (productId: string) => {
  setLoadingItems(prev => new Set(prev).add(productId));
  await increaseQuantity(productId);
  setLoadingItems(prev => {
    const next = new Set(prev);
    next.delete(productId);
    return next;
  });
};
```

### 2. Disable buttons while loading:
```typescript
<button
  className={styles.increaseButton}
  onClick={() => handleIncrease(item.product.id)}
  disabled={loadingItems.has(item.product.id)}
>
  {loadingItems.has(item.product.id) ? (
    <FaSpinner className={styles.spinner} />
  ) : (
    <FaPlus />
  )}
</button>
```

### 3. Add optimistic updates:
- Update UI immediately
- Rollback on error
- Better perceived performance

## Acceptance Criteria
- [ ] Add loading state for cart operations
- [ ] Disable buttons during operations
- [ ] Show spinner icon while loading
- [ ] Implement optimistic UI updates (bonus)
- [ ] Handle errors gracefully (rollback on failure)
- [ ] Test with slow network conditions
- [ ] Ensure no duplicate requests possible
- [ ] Apply to product cards as well

## Related Files
- `src/app/cart/page.tsx`
- `src/components/shop/ProductCard.tsx`
- `src/contexts/CartContext.tsx`
- `src/app/shop/[slug]/ProductDetailsPage.tsx`
