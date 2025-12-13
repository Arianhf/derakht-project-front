# [CRITICAL] Move shipping cost calculation from client to backend

**Labels**: `bug`, `critical`, `checkout`, `backend-required`
**Priority**: 🔴 Critical

## Problem
Shipping costs are hardcoded and calculated client-side in the OrderSummary component, creating data inconsistency and potential security issues.

**Location**: `src/components/checkout/OrderSummary.tsx:13`

```typescript
const shippingCost = cartDetails.total_amount > 500000 ? 0 : 30000;
```

## Impact
- ❌ Client-side calculations can be manipulated
- ❌ No regional shipping variations possible
- ❌ Inconsistency if backend has different rules
- ❌ Potential revenue loss if actual charges differ
- ❌ No dynamic shipping options (express, standard, etc.)

## Proposed Solution
1. Backend should calculate shipping costs based on:
   - Cart total amount
   - Delivery address (province/city)
   - Shipping method selected
   - Product weight/dimensions

2. Frontend should fetch shipping cost from backend API:
   - Add `GET /shop/cart/shipping-estimate/` endpoint
   - Return shipping cost with cart details
   - Update OrderSummary to display fetched value

## Acceptance Criteria
- [ ] Backend API endpoint for shipping calculation
- [ ] Remove hardcoded shipping logic from frontend
- [ ] OrderSummary fetches shipping from backend
- [ ] Shipping cost updates when cart changes
- [ ] Handle multiple shipping methods (if applicable)
- [ ] Add loading state while fetching shipping cost
- [ ] Update checkout flow to use backend shipping cost

## Related Files
- `src/components/checkout/OrderSummary.tsx`
- `src/services/shopService.ts`
- Backend: shipping calculation logic needed
