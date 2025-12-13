# [MEDIUM] Add print/download receipt on order confirmation

**Labels**: `enhancement`, `medium-priority`, `order`, `ux`
**Priority**: 🟠 Medium

## Problem
Users can't download or print their order confirmation, leading to:
- Customer service issues
- No proof of purchase
- Support ticket volume increase
- Poor customer experience

**Location**: `src/components/shop/OrderConfirmationPage.tsx`

## Impact
- Users screenshot the page manually
- No formatted receipt for records
- Difficult for accounting/expense reports
- Support team manually sends confirmations

## Proposed Solution

### 1. Add Print Button
```tsx
import { FaPrint, FaDownload } from 'react-icons/fa';

const handlePrint = () => {
  window.print();
};
```

### 2. Add Download PDF Button (Future)
```tsx
// Using react-pdf or html2pdf
import { generatePDF } from '@/utils/pdfGenerator';

const handleDownloadPDF = async () => {
  const pdf = await generatePDF({
    orderId: order.id,
    items: order.items,
    total: order.total_amount,
    // ... other order details
  });

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `order-${order.id}.pdf`;
  a.click();
};
```

### 3. Print-Friendly CSS
```scss
// orderConfirmation.module.scss
@media print {
  .navbar,
  .actionsContainer,
  .backButton {
    display: none !important;
  }

  .confirmationContainer {
    max-width: 100%;
    margin: 0;
    padding: 20px;
  }

  .orderDetailsCard {
    box-shadow: none;
    border: 1px solid #ddd;
  }

  // Add print-specific styling
  .printHeader {
    display: block;
    text-align: center;
    margin-bottom: 20px;

    img {
      max-width: 150px;
    }
  }

  // Ensure proper page breaks
  .orderItem {
    page-break-inside: avoid;
  }
}

// Hide in normal view, show in print
.printHeader {
  display: none;

  @media print {
    display: block;
  }
}
```

### 4. Update Order Confirmation UI
```tsx
<div className={styles.actionsContainer}>
  <button
    className={`${styles.actionButton} ${styles.printButton}`}
    onClick={handlePrint}
  >
    <FaPrint />
    چاپ رسید
  </button>

  <button
    className={`${styles.actionButton} ${styles.downloadButton}`}
    onClick={handleDownloadPDF}
  >
    <FaDownload />
    دانلود PDF
  </button>

  <button
    className={`${styles.actionButton} ${styles.shopButton}`}
    onClick={handleContinueShopping}
  >
    <FaHome />
    ادامه خرید
  </button>

  <button
    className={styles.actionButton}
    onClick={handleViewOrders}
  >
    <FaListAlt />
    مشاهده سفارش‌ها
  </button>
</div>
```

### 5. Add Print Header (Only Visible When Printing)
```tsx
<div className={styles.printHeader}>
  <Image src={logo} alt="درخت" width={150} height={50} />
  <h2>فروشگاه درخت</h2>
  <p>رسید سفارش</p>
</div>
```

## Implementation Options

**Phase 1** (Simple - Recommended):
- ✅ Add print button with CSS print styles
- ✅ Hide unnecessary elements in print view
- ✅ Format receipt nicely for printing

**Phase 2** (Advanced - Optional):
- 📄 Generate PDF using `jsPDF` or `react-pdf`
- 📧 Email receipt option
- 🔗 Generate shareable link
- ☁️ Backend PDF generation (better quality)

## Acceptance Criteria
- [ ] Add print button to order confirmation
- [ ] Implement print-friendly CSS styles
- [ ] Hide navbar/buttons in print view
- [ ] Add company logo to print view
- [ ] Format receipt for A4 paper
- [ ] Test printing on different browsers
- [ ] Ensure Persian text prints correctly
- [ ] Add download PDF option (Phase 2)
- [ ] Test print preview functionality

## Testing Checklist
- [ ] Chrome print preview
- [ ] Firefox print preview
- [ ] Safari print preview
- [ ] Edge print preview
- [ ] Mobile browser print (if applicable)
- [ ] Persian text renders correctly
- [ ] Page breaks appropriately
- [ ] All order details visible

## Related Files
- `src/components/shop/OrderConfirmationPage.tsx`
- `src/components/shop/orderConfirmation.module.scss`
- New: `src/utils/pdfGenerator.ts` (Phase 2)

## Resources
- [react-to-print](https://www.npmjs.com/package/react-to-print)
- [jsPDF](https://github.com/parallax/jsPDF) (for PDF generation)
- [html2canvas](https://html2canvas.hertzen.com/) (for PDF screenshots)
