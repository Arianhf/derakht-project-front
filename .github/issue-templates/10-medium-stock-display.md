# [MEDIUM] Display stock quantity on product cards and details

**Labels**: `enhancement`, `medium-priority`, `shop`, `ux`
**Priority**: 🟠 Medium

## Problem
Products show only "موجود" (available) or "ناموجود" (unavailable) without actual stock quantities.

**Locations**:
- `src/components/shop/ProductCard.tsx`
- `src/app/shop/[slug]/ProductDetailsPage.tsx`

## Impact
- Users can't see if product has limited stock
- No urgency created for low-stock items
- Can't plan purchases for items with quantity > 1
- Missed opportunity for "Only X left!" messaging

## Proposed Solution

### 1. Display stock on product cards:
```tsx
{product.is_available && (
  <>
    {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
      <div className={styles.lowStockBadge}>
        تنها {toPersianNumber(product.stock_quantity)} عدد باقی مانده
      </div>
    )}
  </>
)}
```

### 2. Show stock on product details:
```tsx
<div className={styles.stockInfo}>
  {product.stock_quantity > 0 ? (
    product.stock_quantity <= 10 ? (
      <span className={styles.lowStock}>
        {toPersianNumber(product.stock_quantity)} عدد موجود
      </span>
    ) : (
      <span className={styles.inStock}>موجود در انبار</span>
    )
  ) : (
    <span className={styles.outOfStock}>ناموجود</span>
  )}
</div>
```

### 3. Prevent adding more than stock allows:
```typescript
const handleIncreaseQuantity = async () => {
  if (quantity >= product.stock_quantity) {
    toast.error(`حداکثر ${toPersianNumber(product.stock_quantity)} عدد موجود است`);
    return;
  }
  await increaseQuantity(product.id);
};
```

## Design Suggestions

**Low Stock Badge** (1-5 items):
- Red/orange background
- "تنها X عدد باقی مانده"

**Medium Stock** (6-10 items):
- Yellow background
- "X عدد موجود"

**High Stock** (11+ items):
- Green background
- "موجود در انبار"

## Acceptance Criteria
- [ ] Add stock quantity display to ProductCard
- [ ] Add stock quantity display to ProductDetailsPage
- [ ] Show "low stock" warning for items with stock <= 5
- [ ] Prevent adding to cart more than available stock
- [ ] Show appropriate colors (red/yellow/green)
- [ ] Use Persian numbers
- [ ] Test with various stock levels (0, 1, 5, 10, 100)
- [ ] Backend should return `stock_quantity` in Product model

## Backend Requirements
Verify Product model includes:
```typescript
interface Product {
  // ... existing fields
  stock_quantity: number; // Must be included in API response
}
```

## Related Files
- `src/components/shop/ProductCard.tsx`
- `src/app/shop/[slug]/ProductDetailsPage.tsx`
- `src/types/shop.ts` (update Product interface)
- `src/components/shop/ProductCard.module.scss`
- `src/app/shop/[slug]/productDetails.module.scss`
