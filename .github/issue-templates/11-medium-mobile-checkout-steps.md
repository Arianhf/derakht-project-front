# [MEDIUM] Fix checkout steps visual indicators on mobile

**Labels**: `bug`, `medium-priority`, `checkout`, `mobile`, `ux`
**Priority**: 🟠 Medium

## Problem
Checkout step indicators change from horizontal to vertical on mobile, but the visual connection lines disappear completely, losing the sense of progress.

**Location**: `src/components/shop/checkout.module.scss:329-355`

```scss
@media (max-width: 768px) {
  .step {
    &:not(:last-child)::after {
      display: none; // Connection lines removed!
    }
  }
}
```

## Impact
- Users lose visual progress indicator on mobile
- Less clear what step they're on
- Poor UX on mobile devices (majority of traffic)

## Current Mobile Behavior
```
1 اطلاعات ارسال
2 روش پرداخت
3 بررسی سفارش
```
(No visual connection between steps)

## Proposed Mobile Design

**Option 1**: Vertical progress bar
```
1 ━━ اطلاعات ارسال ✓
┃
2 ━━ روش پرداخت
┃
3 ━━ بررسی سفارش
```

**Option 2**: Compact horizontal (keep on mobile)
```
1 ━━━ 2 ━━━ 3
اطلاعات  پرداخت  بررسی
```

**Option 3**: Breadcrumb style
```
اطلاعات > پرداخت > بررسی
   ✓
```

## Proposed Solution (Option 1 - Vertical)

```scss
@media (max-width: 768px) {
  .checkoutSteps {
    flex-direction: column;
    align-items: flex-start;
  }

  .step {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    gap: 15px;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 50px;
      right: 20px;
      width: 2px;
      height: calc(100% + 15px);
      background-color: #ddd;
    }

    &.completed::after {
      background-color: #4CAF50;
    }
  }
}
```

## Acceptance Criteria
- [ ] Add vertical connection lines for mobile
- [ ] Maintain visual progress indicator
- [ ] Test on various mobile screen sizes (320px - 768px)
- [ ] Ensure completed steps show green line
- [ ] Ensure current step is clearly highlighted
- [ ] Test with different step counts (3 or 4 steps)
- [ ] Maintain accessibility (ARIA labels)
- [ ] Smooth transitions between steps

## Testing Checklist
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] Samsung Galaxy (360px)
- [ ] iPad Mini (768px)
- [ ] Test in portrait and landscape

## Related Files
- `src/components/shop/checkout.module.scss`
- `src/components/shop/CheckoutPage.tsx`
