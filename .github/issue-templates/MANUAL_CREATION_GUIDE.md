# Manual GitHub Issue Creation Guide

Since the GitHub CLI is not available in the current environment, here's a step-by-step guide to manually create the issues.

## Quick Reference Table

| # | Issue Title | Priority | Labels |
|---|------------|----------|--------|
| 1 | [CRITICAL] Remove or implement non-functional comments section on product details page | 🔴 Critical | `bug`, `critical`, `shop` |
| 2 | [CRITICAL] Move shipping cost calculation from client to backend | 🔴 Critical | `bug`, `critical`, `checkout`, `backend-required` |
| 3 | [CRITICAL] Refactor complex payment verification flow | 🔴 Critical | `bug`, `critical`, `checkout`, `refactor` |
| 4 | [CRITICAL] Fix silent error handling in CartContext | 🔴 Critical | `bug`, `critical`, `cart`, `ux` |
| 5 | [HIGH] Implement pagination for shop product listing | 🟡 High | `enhancement`, `high-priority`, `shop`, `performance` |
| 6 | [HIGH] Fix image loading state issues on product details page | 🟡 High | `bug`, `high-priority`, `shop`, `ux` |
| 7 | [HIGH] Add loading indicators for cart operations | 🟡 High | `enhancement`, `high-priority`, `cart`, `ux` |
| 8 | [HIGH] Optimize cart refresh pattern to reduce API calls | 🟡 High | `enhancement`, `high-priority`, `cart`, `performance` |
| 9 | [HIGH] Add error display and retry mechanism on shop page | 🟡 High | `bug`, `high-priority`, `shop`, `ux` |
| 10 | [MEDIUM] Display stock quantity on product cards and details | 🟠 Medium | `enhancement`, `medium-priority`, `shop`, `ux` |
| 11 | [MEDIUM] Fix checkout steps visual indicators on mobile | 🟠 Medium | `bug`, `medium-priority`, `checkout`, `mobile`, `ux` |
| 12 | [MEDIUM] Implement discount/coupon code system | 🟠 Medium | `enhancement`, `medium-priority`, `checkout`, `feature`, `backend-required` |
| 13 | [MEDIUM] Add print/download receipt on order confirmation | 🟠 Medium | `enhancement`, `medium-priority`, `order`, `ux` |
| 14 | [LOW] Improve accessibility across shop and checkout flow | 🟢 Low | `enhancement`, `low-priority`, `a11y`, `accessibility` |
| 15 | [ENHANCEMENT] Implement product reviews and ratings system | 🟢 Enhancement | `enhancement`, `feature`, `shop`, `backend-required` |

## Step-by-Step Instructions

### Method 1: One-by-one (Recommended for careful review)

1. Navigate to your GitHub repository
2. Click on the **Issues** tab
3. Click **New Issue**
4. For each issue file (01 through 15):
   - Open the corresponding `.md` file in `.github/issue-templates/`
   - Copy the **title** (first line, remove the `#` and `**` markers)
   - Copy the **entire content** starting from line 5 (skip title, labels, priority lines)
   - Paste into the issue body
   - Add the **labels** from the table above
   - Click **Submit new issue**

### Method 2: Bulk Creation (Faster but requires GitHub CLI)

If you can install the GitHub CLI on your local machine:

```bash
# 1. Install GitHub CLI
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 2. Authenticate
gh auth login

# 3. Navigate to project
cd /path/to/derakht-project-front

# 4. Run the script
./scripts/create-github-issues.sh
```

### Method 3: Using GitHub Web Interface with Copy-Paste

For each issue:

1. Open the issue template file in your code editor
2. Copy everything after line 4 (skip title, labels, priority)
3. Go to: https://github.com/YOUR_USERNAME/derakht-project-front/issues/new
4. Title: Copy from line 1 (remove `#`)
5. Body: Paste the copied content
6. Labels: Add from the table above
7. Click **Submit new issue**

## Labels to Create First

Before creating issues, ensure these labels exist in your repository.

### Option A: Automated Label Creation (Recommended)

If you have GitHub CLI installed locally, use the automation script:

```bash
./scripts/create-github-labels.sh
```

This will create all 18 required labels automatically.

### Option B: Manual Label Creation

Go to: `https://github.com/YOUR_USERNAME/derakht-project-front/labels`

Create these labels if they don't exist:

| Label | Color | Description |
|-------|-------|-------------|
| `critical` | `#d73a4a` | Critical priority - must fix immediately |
| `high-priority` | `#ff9800` | High priority issues |
| `medium-priority` | `#ffc107` | Medium priority issues |
| `low-priority` | `#4caf50` | Low priority issues |
| `bug` | `#d73a4a` | Something isn't working |
| `enhancement` | `#a2eeef` | New feature or request |
| `feature` | `#0e8a16` | New feature |
| `shop` | `#1d76db` | Shop/product related |
| `cart` | `#1d76db` | Cart related |
| `checkout` | `#1d76db` | Checkout flow |
| `order` | `#1d76db` | Order management |
| `mobile` | `#f9d0c4` | Mobile-specific |
| `ux` | `#e4e669` | User experience |
| `performance` | `#fbca04` | Performance improvement |
| `a11y` | `#5319e7` | Accessibility |
| `accessibility` | `#5319e7` | Accessibility |
| `refactor` | `#d4c5f9` | Code refactoring |
| `backend-required` | `#d876e3` | Requires backend changes |

## Tips for Manual Creation

1. **Start with Critical Issues** - Create issues 1-4 first
2. **Use Templates** - The markdown files are ready to paste
3. **Add Milestones** - Consider creating milestones:
   - "Week 1: Critical Fixes"
   - "Week 2-3: High Priority"
   - "Week 4-5: Medium Priority"
   - "Future: Enhancements"
4. **Assign Issues** - Assign to team members as you create them
5. **Add to Projects** - If using GitHub Projects, add to appropriate columns

## Estimated Time

- **Method 1**: ~30-45 minutes (2-3 minutes per issue)
- **Method 2**: ~2 minutes (automated)
- **Method 3**: ~20-30 minutes (with copy-paste)

## Verification

After creating all issues, you should have:
- ✅ 4 issues labeled `critical`
- ✅ 5 issues labeled `high-priority`
- ✅ 4 issues labeled `medium-priority`
- ✅ 2 issues labeled `low-priority` or `enhancement`
- ✅ **Total: 15 issues**

## Next Steps

After creating the issues:

1. **Prioritize** - Review and adjust priorities based on your business needs
2. **Assign** - Assign to team members
3. **Plan** - Add to sprints/milestones
4. **Link** - Link related issues together
5. **Track** - Use GitHub Projects for tracking progress

## Questions?

If you have questions about any issue:
- Refer to the original analysis in the project chat
- Check the detailed description in the issue template
- Review `CLAUDE.md` for project context
- Comment on the issue for clarification
