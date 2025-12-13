# [CRITICAL] Refactor complex payment verification flow

**Labels**: `bug`, `critical`, `checkout`, `refactor`
**Priority**: 🔴 Critical

## Problem
The payment verification logic in the checkout page is overly complex with nested conditionals, inconsistent error handling, and runs on every render.

**Location**: `src/components/shop/CheckoutPage.tsx:72-123`

### Issues:
1. **Long useEffect with nested conditions** - Difficult to maintain and test
2. **Runs on every component render** - No dependency array optimization
3. **Inconsistent URL encoding**: `decodeURIComponent(encodeURIComponent(errorMessage))`
4. **Multiple redirect paths** - Hard to trace error flows
5. **Error handling scattered across redirects**

## Impact
- Potential duplicate API calls
- Payment verification failures
- Poor error messages reaching users
- Difficult debugging in production
- Performance overhead from unnecessary effect runs

## Proposed Solution

### 1. Extract payment verification to custom hook:
```typescript
// hooks/usePaymentVerification.ts
export function usePaymentVerification() {
  // Centralized verification logic
  // Returns { status, loading, error }
}
```

### 2. Use proper dependency array:
```typescript
useEffect(() => {
  handlePaymentReturn();
}, [searchParams]); // Only run when URL params change
```

### 3. Centralize error handling:
- Single error state
- Consistent error messages
- One error display component

### 4. Simplify flow:
- Success → verify → confirm page
- Failure → payment failed page
- Unknown → payment failed page with generic message

## Acceptance Criteria
- [ ] Create `usePaymentVerification` custom hook
- [ ] Reduce useEffect complexity (< 30 lines)
- [ ] Add proper dependency array
- [ ] Centralize error handling
- [ ] Add unit tests for verification logic
- [ ] Document payment flow in comments/docs
- [ ] Test all payment scenarios (success, failure, cancel)

## Related Files
- `src/components/shop/CheckoutPage.tsx`
- `src/services/shopService.ts`
- New: `src/hooks/usePaymentVerification.ts`
