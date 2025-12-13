# Shop & Checkout Flow - Issue Templates

This directory contains detailed issue templates for improving the shop and checkout flow based on a comprehensive code analysis performed on 2025-12-13.

## 📊 Issue Summary

- **Critical Priority**: 4 issues
- **High Priority**: 5 issues
- **Medium Priority**: 4 issues
- **Low Priority / Enhancements**: 2 issues

**Total**: 15 issues

## 🔴 Critical Priority Issues

These issues must be fixed immediately as they affect functionality, security, or user trust:

1. **01-critical-comments-section.md** - Non-functional comments section misleading users
2. **02-critical-shipping-cost.md** - Client-side shipping calculation (security issue)
3. **03-critical-payment-verification.md** - Complex payment flow prone to errors
4. **04-critical-cart-error-handling.md** - Silent errors hiding problems from users

## 🟡 High Priority Issues

These issues significantly impact UX and performance:

5. **05-high-pagination.md** - Missing pagination causing performance issues
6. **06-high-image-loading-state.md** - Image loading bugs
7. **07-high-cart-loading-indicators.md** - No loading feedback in cart
8. **08-high-cart-refresh-optimization.md** - Inefficient API call patterns
9. **09-high-error-display-shop.md** - No error display or retry mechanism

## 🟠 Medium Priority Issues

Important features and UX improvements:

10. **10-medium-stock-display.md** - Show stock quantities
11. **11-medium-mobile-checkout-steps.md** - Mobile checkout UI issues
12. **12-medium-discount-system.md** - Implement coupon/discount codes
13. **13-medium-order-receipt.md** - Print/download order receipt

## 🟢 Low Priority / Enhancements

Quality of life and accessibility improvements:

14. **14-low-accessibility.md** - Comprehensive accessibility improvements
15. **15-enhancement-product-reviews.md** - Full review and rating system

## 📝 How to Use These Templates

### Option 1: Manual Creation (No GitHub CLI)
1. Copy the content from each `.md` file
2. Go to your GitHub repository
3. Navigate to **Issues** → **New Issue**
4. Paste the content
5. Add the labels mentioned at the top of each file
6. Submit the issue

### Option 2: Using GitHub CLI (Recommended)
If you have `gh` CLI installed:

```bash
# Navigate to project root
cd /path/to/derakht-project-front

# Create issues from templates
for file in .github/issue-templates/*.md; do
  if [[ $file == *"README"* ]]; then
    continue
  fi

  # Extract title (first line without #)
  title=$(head -n 1 "$file" | sed 's/# //')

  # Extract labels from the file
  labels=$(grep "Labels:" "$file" | sed 's/.*Labels.*: //' | sed 's/`//g')

  # Create issue
  gh issue create \
    --title "$title" \
    --body-file "$file" \
    --label "$labels"
done
```

### Option 3: Batch Import Script
Create a script `create-issues.sh`:

```bash
#!/bin/bash

# Array of issue files in priority order
issues=(
  "01-critical-comments-section.md"
  "02-critical-shipping-cost.md"
  "03-critical-payment-verification.md"
  "04-critical-cart-error-handling.md"
  "05-high-pagination.md"
  "06-high-image-loading-state.md"
  "07-high-cart-loading-indicators.md"
  "08-high-cart-refresh-optimization.md"
  "09-high-error-display-shop.md"
  "10-medium-stock-display.md"
  "11-medium-mobile-checkout-steps.md"
  "12-medium-discount-system.md"
  "13-medium-order-receipt.md"
  "14-low-accessibility.md"
  "15-enhancement-product-reviews.md"
)

for issue_file in "${issues[@]}"; do
  echo "Creating issue from $issue_file..."

  # Extract title
  title=$(head -n 1 ".github/issue-templates/$issue_file" | sed 's/# //')

  # Extract labels
  labels=$(grep "Labels:" ".github/issue-templates/$issue_file" | sed 's/.*Labels.*: //' | sed 's/`//g' | sed 's/,/, /g')

  # Create issue
  gh issue create \
    --title "$title" \
    --body-file ".github/issue-templates/$issue_file" \
    --label "$labels"

  echo "✓ Created: $title"
  sleep 1  # Rate limiting
done

echo "✓ All issues created!"
```

Make executable and run:
```bash
chmod +x create-issues.sh
./create-issues.sh
```

## 🎯 Recommended Implementation Order

### Week 1: Critical Fixes
- Fix #1 (Comments section)
- Fix #2 (Shipping cost)
- Fix #3 (Payment verification)
- Fix #4 (Cart error handling)

### Week 2-3: High Priority
- Implement #5 (Pagination)
- Fix #6 (Image loading)
- Add #7 (Loading indicators)
- Optimize #8 (Cart refresh)
- Fix #9 (Error display)

### Week 4-5: Medium Priority
- Add #10 (Stock display)
- Fix #11 (Mobile checkout)
- Implement #12 (Discount system)
- Add #13 (Order receipt)

### Week 6+: Enhancements
- Improve #14 (Accessibility)
- Implement #15 (Review system)

## 📌 Labels to Create in GitHub

Make sure these labels exist in your repository:

```
bug
critical
high-priority
medium-priority
low-priority
enhancement
feature
shop
cart
checkout
order
mobile
ux
performance
a11y
accessibility
refactor
backend-required
```

## 📚 Related Documentation

- Original analysis: See analysis report in project chat
- Testing strategy: `TESTING_STRATEGY.md`
- Project guidelines: `CLAUDE.md`

## 🤝 Contributing

When working on these issues:
1. Create a feature branch: `git checkout -b fix/issue-number-description`
2. Reference the issue in commits: `Fix #XX: description`
3. Follow coding standards in `CLAUDE.md`
4. Add tests for new functionality
5. Update relevant documentation

## 📞 Questions?

If you need clarification on any issue:
- Comment on the GitHub issue
- Reference the original analysis
- Check `CLAUDE.md` for project context
