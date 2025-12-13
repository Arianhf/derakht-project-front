# [HIGH] Optimize cart refresh pattern to reduce API calls

**Labels**: `enhancement`, `high-priority`, `cart`, `performance`
**Priority**: 🟡 High

## Problem
Every cart modification calls `refreshCart()` which fetches the entire cart, even though the backend likely returns the updated cart in the response.

**Location**: `src/contexts/CartContext.tsx:57-73`

```typescript
await shopService.addToCart(productId, quantity);
await refreshCart(); // Unnecessary full cart fetch
```

## Impact
- Unnecessary API calls (2 requests instead of 1)
- Increased server load
- Slower perceived performance
- Wasted bandwidth
- Poor experience on slow networks

## Proposed Solution

### 1. Use response from cart operations:
```typescript
const addToCart = async (productId: string, quantity = 1) => {
  try {
    setLoading(true);
    const updatedCart = await shopService.addToCart(productId, quantity);
    setCartDetails(updatedCart); // Use response directly
    toast.success('محصول به سبد خرید اضافه شد');
  } catch (error) {
    // Handle error and refresh only on failure
    await refreshCart();
  }
}
```

### 2. Update backend endpoints to return full cart:
Verify that these endpoints return complete cart details:
- `POST /shop/cart/add_item/` → should return updated cart
- `POST /shop/cart/update_quantity/` → should return updated cart
- `POST /shop/cart/remove_item/` → should return updated cart

### 3. Keep refresh as fallback:
```typescript
// Only refresh when needed:
// - Initial load
// - After errors
// - After login/logout
// - Manual refresh button
```

## Acceptance Criteria
- [ ] Verify backend endpoints return full cart data
- [ ] Update addToCart to use response directly
- [ ] Update increaseQuantity to use response
- [ ] Update decreaseQuantity to use response
- [ ] Update removeFromCart to use response
- [ ] Keep refreshCart for error recovery
- [ ] Test all cart operations work correctly
- [ ] Monitor network tab - should see 50% fewer requests
- [ ] Add error recovery with refresh fallback

## Performance Metrics
**Before**: 2 API calls per cart operation (modify + refresh)
**After**: 1 API call per cart operation
**Expected improvement**: 50% reduction in cart-related API calls

## Related Files
- `src/contexts/CartContext.tsx`
- `src/services/shopService.ts`
- Backend endpoints (verify response structure)
