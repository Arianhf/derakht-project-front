# [ENHANCEMENT] Implement product reviews and ratings system

**Labels**: `enhancement`, `feature`, `shop`, `backend-required`
**Priority**: 🟢 Enhancement

## Problem
Currently, the product details page has a non-functional comments section. A proper review system would provide social proof and help users make purchasing decisions.

## Impact
- Increased conversion rates (reviews boost sales by 18-270%)
- Better product feedback for business
- Improved SEO (user-generated content)
- Enhanced trust and credibility

## Proposed Solution

### 1. Star Rating Display
```tsx
// components/shop/ProductRating.tsx
export const ProductRating: React.FC<{ rating: number; reviewCount: number }> = ({
  rating,
  reviewCount
}) => {
  return (
    <div className={styles.rating}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? styles.filled : styles.empty}
          />
        ))}
      </div>
      <span className={styles.ratingValue}>
        {toPersianNumber(rating.toFixed(1))}
      </span>
      <span className={styles.reviewCount}>
        ({toPersianNumber(reviewCount)} نظر)
      </span>
    </div>
  );
};
```

### 2. Review Form
```tsx
// components/shop/ReviewForm.tsx
export const ReviewForm: React.FC<{ productId: string }> = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('برای ثبت نظر باید وارد شوید');
      return;
    }

    await shopService.submitReview({
      product_id: productId,
      rating,
      title,
      comment,
    });

    toast.success('نظر شما ثبت شد و پس از تایید نمایش داده می‌شود');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h3>نظر خود را ثبت کنید</h3>

      <div className={styles.ratingInput}>
        <label>امتیاز شما:</label>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={star <= rating ? styles.filled : styles.empty}
            >
              <FaStar />
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        placeholder="عنوان نظر"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="نظر خود را بنویسید..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        minLength={10}
      />

      <button type="submit" disabled={rating === 0}>
        ثبت نظر
      </button>
    </form>
  );
};
```

### 3. Review List
```tsx
// components/shop/ReviewList.tsx
export const ReviewList: React.FC<{ productId: string }> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const data = await shopService.getProductReviews(productId);
    setReviews(data);
    setLoading(false);
  };

  return (
    <div className={styles.reviewList}>
      <h3>نظرات کاربران ({toPersianNumber(reviews.length)})</h3>

      {reviews.map((review) => (
        <div key={review.id} className={styles.review}>
          <div className={styles.reviewHeader}>
            <div className={styles.reviewAuthor}>
              <strong>{review.user.name}</strong>
              <ProductRating rating={review.rating} reviewCount={0} />
            </div>
            <span className={styles.reviewDate}>
              {toPersianNumber(new Date(review.created_at).toLocaleDateString('fa-IR'))}
            </span>
          </div>

          {review.title && (
            <h4 className={styles.reviewTitle}>{review.title}</h4>
          )}

          <p className={styles.reviewComment}>{review.comment}</p>

          {review.verified_purchase && (
            <span className={styles.verifiedBadge}>
              <FaCheckCircle /> خریدار محصول
            </span>
          )}

          <div className={styles.reviewActions}>
            <button onClick={() => handleHelpful(review.id)}>
              <FaThumbsUp /> مفید بود ({toPersianNumber(review.helpful_count)})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 4. Rating Summary
```tsx
// components/shop/RatingSummary.tsx
export const RatingSummary: React.FC<{ productId: string }> = ({ productId }) => {
  // Show breakdown of ratings (5 stars: 70%, 4 stars: 20%, etc.)
  return (
    <div className={styles.ratingSummary}>
      <div className={styles.overallRating}>
        <div className={styles.ratingNumber}>{toPersianNumber(4.5)}</div>
        <ProductRating rating={4.5} reviewCount={120} />
      </div>

      <div className={styles.ratingBreakdown}>
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className={styles.ratingRow}>
            <span>{toPersianNumber(stars)} ستاره</span>
            <div className={styles.ratingBar}>
              <div
                className={styles.ratingBarFill}
                style={{ width: `${getPercentage(stars)}%` }}
              />
            </div>
            <span>{toPersianNumber(getCount(stars))}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Features to Include

### Core Features
- ✅ Star rating (1-5 stars)
- ✅ Review title and comment
- ✅ User authentication required
- ✅ Review moderation (admin approval)
- ✅ Verified purchase badge
- ✅ Helpful/not helpful voting

### Advanced Features (Optional)
- 📸 Image upload with reviews
- 🎥 Video reviews
- 💬 Merchant responses
- 🏷️ Review tags (size, quality, shipping, etc.)
- ⚖️ Pros and cons list
- 🔍 Filter/sort reviews
- ❓ Q&A section

## Backend API Endpoints Needed

```typescript
// Get product reviews
GET /shop/products/{slug}/reviews/
Response: {
  average_rating: 4.5,
  total_reviews: 120,
  reviews: [...]
}

// Submit review
POST /shop/reviews/
Body: {
  product_id: "uuid",
  rating: 5,
  title: "عالی بود!",
  comment: "کیفیت عالی و ارسال سریع",
  images: [] // optional
}

// Mark helpful
POST /shop/reviews/{id}/helpful/

// Admin: Approve review
PATCH /shop/reviews/{id}/approve/
```

## Database Schema

```typescript
interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  verified_purchase: boolean;
  helpful_count: number;
  not_helpful_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;

  // Relations
  user: {
    name: string;
    avatar?: string;
  };
  merchant_response?: {
    comment: string;
    created_at: string;
  };
}
```

## Acceptance Criteria
- [ ] Backend API for reviews CRUD
- [ ] Review submission form
- [ ] Review list display
- [ ] Star rating component
- [ ] Rating summary/breakdown
- [ ] User authentication required
- [ ] Admin moderation system
- [ ] Verified purchase badge
- [ ] Helpful voting system
- [ ] Pagination for reviews
- [ ] Sort/filter options
- [ ] Responsive design
- [ ] Replace current comments section

## Metrics to Track
- Review submission rate
- Average rating per product
- Impact on conversion rate
- Helpful votes per review

## Related Files
- Replace: `src/app/shop/[slug]/ProductDetailsPage.tsx` (comments section)
- New: `src/components/shop/ProductRating.tsx`
- New: `src/components/shop/ReviewForm.tsx`
- New: `src/components/shop/ReviewList.tsx`
- New: `src/components/shop/RatingSummary.tsx`
- `src/services/shopService.ts`
- `src/types/shop.ts` (add Review interface)

## References
- Amazon reviews (best practice)
- Digikala reviews (Persian example)
- [Review schema markup](https://schema.org/Review) for SEO
