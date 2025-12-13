# [CRITICAL] Fix silent error handling in CartContext

**Labels**: `bug`, `critical`, `cart`, `ux`
**Priority**: 🔴 Critical

## Problem
The CartContext silently swallows errors without informing users, leading to stale data and confusion.

**Location**: `src/contexts/CartContext.tsx:41-51`

```typescript
catch (error) {
  // Error fetching cart - silently handle in production
}
```

## Impact
- Users don't know when cart refresh fails
- Stale cart data displayed
- User confusion when actions don't reflect
- Difficult to debug production issues
- Poor user experience during network failures

## Proposed Solution

### 1. Add error state to context:
```typescript
interface CartContextType {
  cartDetails: CartDetails | null;
  loading: boolean;
  error: string | null; // Add this
  // ... other methods
}
```

### 2. Display errors to users:
- Show toast notification for transient errors
- Display inline error message in cart UI
- Provide retry mechanism

### 3. Log errors for debugging:
```typescript
catch (error) {
  console.error('Cart refresh failed:', error);
  setError('خطا در بارگذاری سبد خرید');
  toast.error('خطا در بارگذاری سبد خرید. لطفا مجددا تلاش کنید.');
}
```

### 4. Implement error recovery:
- Auto-retry with exponential backoff
- Manual retry button
- Clear error state on successful operation

## Acceptance Criteria
- [ ] Add error state to CartContext
- [ ] Display error messages to users (toast + inline)
- [ ] Add retry mechanism for failed operations
- [ ] Log errors for debugging (console.error)
- [ ] Test error scenarios (network failure, 500 errors)
- [ ] Update cart UI to show error state
- [ ] Remove all silent error handlers

## Related Files
- `src/contexts/CartContext.tsx`
- All components using `useCart()` hook
