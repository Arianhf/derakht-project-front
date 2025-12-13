#!/bin/bash

# Script to create GitHub labels for the issue templates
# Usage: ./scripts/create-github-labels.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "GitHub Labels Creator"
echo "========================================"
echo ""

# Check if gh CLI is installed
echo -e "${BLUE}[DEBUG] Checking if gh CLI is installed...${NC}"
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    exit 1
fi
echo -e "${BLUE}[DEBUG] gh CLI found${NC}"

# Check if authenticated
echo -e "${BLUE}[DEBUG] Checking GitHub authentication...${NC}"
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub${NC}"
    exit 1
fi
echo -e "${BLUE}[DEBUG] Authentication successful${NC}"

echo -e "${GREEN}✓ GitHub CLI is installed and authenticated${NC}"
echo ""

# Check if we're in a git repo
echo -e "${BLUE}[DEBUG] Checking if we're in a git repository...${NC}"
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    echo "Please run this script from your repository directory"
    exit 1
fi
echo -e "${BLUE}[DEBUG] Git repository detected${NC}"

# Show which repo we're working with (cache this value)
echo -e "${BLUE}[DEBUG] Fetching repository name...${NC}"
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
echo -e "${BLUE}[DEBUG] Repository name retrieved: $REPO${NC}"

if [ -z "$REPO" ]; then
    echo -e "${RED}Error: Could not determine repository${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Working with repository: $REPO${NC}"
echo ""

# Define labels with name:color:description format
labels=(
  "critical:d73a4a:Critical priority - must fix immediately"
  "high-priority:ff9800:High priority issues"
  "medium-priority:ffc107:Medium priority issues"
  "low-priority:4caf50:Low priority issues"
  "bug:d73a4a:Something isn't working"
  "enhancement:a2eeef:New feature or request"
  "feature:0e8a16:New feature"
  "shop:1d76db:Shop/product related"
  "cart:1d76db:Cart related"
  "checkout:1d76db:Checkout flow"
  "order:1d76db:Order management"
  "mobile:f9d0c4:Mobile-specific"
  "ux:e4e669:User experience"
  "performance:fbca04:Performance improvement"
  "a11y:5319e7:Accessibility"
  "accessibility:5319e7:Accessibility"
  "refactor:d4c5f9:Code refactoring"
  "backend-required:d876e3:Requires backend changes"
)

echo -e "${BLUE}[DEBUG] Total labels to create: ${#labels[@]}${NC}"
echo "This will create ${#labels[@]} labels in your GitHub repository."
echo ""
read -p "Do you want to proceed? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Creating labels..."
echo ""

created=0
skipped=0
failed=0

for label_spec in "${labels[@]}"; do
  echo -e "${BLUE}[DEBUG] Processing label spec: $label_spec${NC}"

  # Split into name, color, description
  IFS=':' read -r name color description <<< "$label_spec"

  echo -e "${BLUE}[DEBUG] Parsed - Name: '$name', Color: '$color', Description: '$description'${NC}"
  echo -n "Processing: $name ... "

  # Try to create the label and capture output
  echo -e "${BLUE}[DEBUG] Executing: gh label create \"$name\" --color \"$color\" --description \"$description\" --repo \"$REPO\"${NC}"

  output=$(gh label create "$name" --color "$color" --description "$description" --repo "$REPO" --force 2>&1)
  exit_code=$?

  echo -e "${BLUE}[DEBUG] Command exit code: $exit_code${NC}"
  echo -e "${BLUE}[DEBUG] Command output: $output${NC}"

  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✓ created${NC}"
    created=$((created + 1))  # FIXED: Use this instead of ((created++))
  elif echo "$output" | grep -qi "already exists"; then
    echo -e "${YELLOW}already exists${NC}"
    skipped=$((skipped + 1))  # FIXED: Use this instead of ((skipped++))
  else
    echo -e "${RED}✗ failed${NC}"
    echo -e "${RED}Error: $output${NC}"
    failed=$((failed + 1))  # FIXED: Use this instead of ((failed++))
  fi

  echo -e "${BLUE}[DEBUG] Label processing complete${NC}"
  echo ""
done

echo ""
echo "========================================"
echo -e "${GREEN}Summary:${NC}"
echo "  Created: $created labels"
echo "  Already existed: $skipped labels"
if [ $failed -gt 0 ]; then
  echo -e "  ${RED}Failed: $failed labels${NC}"
fi
echo "========================================"
echo ""
echo "You can now run: ./scripts/create-github-issues.sh"