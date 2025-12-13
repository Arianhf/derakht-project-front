# [CRITICAL] Remove or implement non-functional comments section on product details page

**Labels**: `bug`, `critical`, `shop`
**Priority**: 🔴 Critical

## Problem
The comments section on the product details page (`/shop/[slug]`) is completely non-functional. Comments are stored in local React state and disappear on page refresh, creating a misleading user experience.

**Location**: `src/app/shop/[slug]/ProductDetailsPage.tsx:302-331`

```typescript
const [comments, setComments] = useState<Array<{ id: string; text: string }>>([]);
// Comments never persist - purely decorative
```

## Impact
- Users write comments that immediately disappear
- Creates false expectations about functionality
- Poor UX and potential user frustration

## Proposed Solution
**Option 1** (Recommended): Remove the comments section entirely until backend support is ready

**Option 2**: Implement proper backend integration with:
- API endpoints for comment CRUD operations
- User authentication requirement
- Comment moderation system

## Acceptance Criteria
- [ ] Either remove the comments section UI completely, OR
- [ ] Implement full backend integration with persistent storage
- [ ] Add tests for comment functionality (if implemented)
- [ ] Update product page to reflect changes

## Related Files
- `src/app/shop/[slug]/ProductDetailsPage.tsx`
