#!/bin/bash

# Script to create GitHub issues from templates
# Usage: ./scripts/create-github-issues.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "GitHub Issues Creator"
echo "========================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo ""
    echo "Please install it first:"
    echo "  macOS: brew install gh"
    echo "  Linux: See https://github.com/cli/cli#installation"
    echo ""
    echo "After installation, authenticate with:"
    echo "  gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub${NC}"
    echo ""
    echo "Please run: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI is installed and authenticated${NC}"
echo ""

# Issue templates directory
TEMPLATES_DIR=".github/issue-templates"

# Array of issue files in priority order
issues=(
  "01-critical-comments-section.md:bug,critical,shop"
  "02-critical-shipping-cost.md:bug,critical,checkout,backend-required"
  "03-critical-payment-verification.md:bug,critical,checkout,refactor"
  "04-critical-cart-error-handling.md:bug,critical,cart,ux"
  "05-high-pagination.md:enhancement,high-priority,shop,performance"
  "06-high-image-loading-state.md:bug,high-priority,shop,ux"
  "07-high-cart-loading-indicators.md:enhancement,high-priority,cart,ux"
  "08-high-cart-refresh-optimization.md:enhancement,high-priority,cart,performance"
  "09-high-error-display-shop.md:bug,high-priority,shop,ux"
  "10-medium-stock-display.md:enhancement,medium-priority,shop,ux"
  "11-medium-mobile-checkout-steps.md:bug,medium-priority,checkout,mobile,ux"
  "12-medium-discount-system.md:enhancement,medium-priority,checkout,feature,backend-required"
  "13-medium-order-receipt.md:enhancement,medium-priority,order,ux"
  "14-low-accessibility.md:enhancement,low-priority,a11y,accessibility"
  "15-enhancement-product-reviews.md:enhancement,feature,shop,backend-required"
)

# Ask for confirmation
echo "This will create ${#issues[@]} issues in your GitHub repository."
echo ""
read -p "Do you want to proceed? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Creating issues..."
echo ""

created=0
failed=0

for issue_spec in "${issues[@]}"; do
  # Split filename and labels
  IFS=':' read -r issue_file labels <<< "$issue_spec"

  echo -e "${YELLOW}Processing: $issue_file${NC}"

  # Extract title (first line without # and ** markers)
  title=$(head -n 1 "$TEMPLATES_DIR/$issue_file" | sed 's/# //' | sed 's/\*\*//g')

  # Create temporary file without the first 3 lines (title, labels, priority)
  temp_body=$(mktemp)
  tail -n +5 "$TEMPLATES_DIR/$issue_file" > "$temp_body"

  # Create issue
  if gh issue create \
    --title "$title" \
    --body-file "$temp_body" \
    --label "$labels" 2>&1; then

    echo -e "${GREEN}✓ Created: $title${NC}"
    created=$((created + 1))
  else
    echo -e "${RED}✗ Failed: $title${NC}"
    echo -e "${RED}Error output above${NC}"
    failed=$((failed + 1))
  fi

  # Clean up temp file
  rm "$temp_body"

  # Rate limiting - wait 1 second between requests
  sleep 1
done

echo ""
echo "========================================"
echo -e "${GREEN}Summary:${NC}"
echo "  Created: $created issues"
if [ $failed -gt 0 ]; then
  echo -e "  ${RED}Failed: $failed issues${NC}"
fi
echo "========================================"
echo ""
echo "View issues at:"
gh repo view --web
