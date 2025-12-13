# [HIGH] Implement pagination for shop product listing

**Labels**: `enhancement`, `high-priority`, `shop`, `performance`
**Priority**: 🟡 High

## Problem
The shop page fetches ALL products without pagination, causing performance issues.

**Location**: `src/app/shop/ShopPage.tsx:37`

```typescript
const data = await shopService.getProducts(appliedFilters);
setProducts(data.results || []); // Loads all products at once
```

## Impact
- Poor performance with large product catalogs (100+ products)
- Unnecessary network bandwidth consumption
- Slow initial page load
- Poor mobile experience
- Increased server load

## Proposed Solution

Implement **infinite scroll pagination** (recommended for e-commerce):

### Backend changes needed:
```typescript
GET /shop/products/?page=1&page_size=20
Response: {
  count: 150,
  next: "/shop/products/?page=2&page_size=20",
  previous: null,
  results: [...]
}
```

### Frontend implementation:
1. Use intersection observer for infinite scroll
2. Load 20 products initially
3. Load more when user scrolls to bottom
4. Show loading skeleton during fetch
5. Handle end of list gracefully

**Alternative**: Traditional pagination with page numbers (if preferred)

## Acceptance Criteria
- [ ] Backend supports pagination (verify API endpoints)
- [ ] Implement infinite scroll OR page-based pagination
- [ ] Show loading state when fetching more products
- [ ] Handle empty states properly
- [ ] Preserve scroll position on navigation back
- [ ] Update filters to work with pagination
- [ ] Add loading skeleton for better UX
- [ ] Test with large product catalog (100+ items)
- [ ] Ensure mobile performance is good

## Technical Notes
Consider using:
- `react-intersection-observer` for scroll detection
- `react-window` or `react-virtualized` for very large lists
- Existing pagination pattern from qesse-khooneh infinite scroll (PR #47)

## Related Files
- `src/app/shop/ShopPage.tsx`
- `src/services/shopService.ts`
- Reference: Infinite scroll implementation in qesse-khooneh page
