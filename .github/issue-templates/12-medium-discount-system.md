# [MEDIUM] Implement discount/coupon code system

**Labels**: `enhancement`, `medium-priority`, `checkout`, `feature`, `backend-required`
**Priority**: 🟠 Medium

## Problem
No way to apply discount codes in cart or checkout, missing a key e-commerce feature.

## Impact
- Lost marketing opportunities
- Can't run promotions
- No referral/loyalty programs possible
- Competitive disadvantage

## Proposed Solution

### Frontend Components Needed:

#### 1. Coupon Input in Cart/Checkout
```tsx
// components/checkout/CouponCode.tsx
export const CouponCode: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { applyCoupon, removeCoupon, appliedCoupon } = useCart();

  const handleApply = async () => {
    setLoading(true);
    try {
      await applyCoupon(code);
      toast.success('کد تخفیف اعمال شد');
      setCode('');
    } catch (error) {
      toast.error('کد تخفیف نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.couponContainer}>
      {appliedCoupon ? (
        <div className={styles.appliedCoupon}>
          <span>کد تخفیف: {appliedCoupon.code}</span>
          <span>تخفیف: {formatPrice(appliedCoupon.discount)}</span>
          <button onClick={removeCoupon}>حذف</button>
        </div>
      ) : (
        <div className={styles.couponInput}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="کد تخفیف را وارد کنید"
          />
          <button onClick={handleApply} disabled={!code || loading}>
            اعمال کد
          </button>
        </div>
      )}
    </div>
  );
};
```

#### 2. Update Cart Context
```typescript
interface CartContextType {
  // ... existing
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
}
```

#### 3. Update OrderSummary
```tsx
<div className={styles.summaryRow}>
  <span>جمع سبد خرید</span>
  <span>{formatPrice(cartDetails.total_amount)}</span>
</div>

{appliedCoupon && (
  <div className={styles.summaryRow} style={{ color: 'green' }}>
    <span>تخفیف ({appliedCoupon.code})</span>
    <span>-{formatPrice(appliedCoupon.discount_amount)}</span>
  </div>
)}

<div className={styles.summaryRow}>
  <span>هزینه ارسال</span>
  <span>{formatPrice(shippingCost)}</span>
</div>

<div className={styles.totalRow}>
  <span>مبلغ قابل پرداخت</span>
  <span>{formatPrice(finalTotal)}</span>
</div>
```

### Backend API Endpoints Needed:

```
POST /shop/cart/apply-coupon/
Body: { "code": "SUMMER2024" }
Response: {
  "discount_amount": 50000,
  "discount_percentage": 10,
  "code": "SUMMER2024",
  "cart": { ... updated cart with discount }
}

DELETE /shop/cart/remove-coupon/
Response: { ... updated cart without discount }
```

### Coupon Types to Support:

1. **Percentage Discount**: 10% off
2. **Fixed Amount**: 50,000 تومان off
3. **Free Shipping**: Shipping cost = 0
4. **Minimum Purchase**: Apply only if cart > X
5. **Maximum Discount**: Cap discount at Y
6. **First Order**: Only for new customers
7. **Product-Specific**: Discount on specific products
8. **Category-Specific**: Discount on specific categories
9. **One-time Use**: Track used coupons
10. **Expiration Date**: Valid until date

## Acceptance Criteria
- [ ] Backend API for applying/removing coupons
- [ ] Frontend CouponCode component
- [ ] Update CartContext to handle coupons
- [ ] Display discount in OrderSummary
- [ ] Show error for invalid codes
- [ ] Show error for expired codes
- [ ] Show error for minimum purchase not met
- [ ] Validate coupon before checkout
- [ ] Store applied coupon in order
- [ ] Test various coupon types
- [ ] Admin panel for creating coupons (backend)

## Related Files
- New: `src/components/checkout/CouponCode.tsx`
- `src/contexts/CartContext.tsx`
- `src/components/checkout/OrderSummary.tsx`
- `src/services/shopService.ts`
- `src/types/shop.ts` (add Coupon interface)
- Backend: Coupon model and endpoints

## Types to Add
```typescript
interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  discount_amount: number; // Calculated discount
  minimum_purchase?: number;
  maximum_discount?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit?: number;
  used_count: number;
}
```
