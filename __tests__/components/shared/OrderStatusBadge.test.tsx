import { render, screen } from '@testing-library/react'
import OrderStatusBadge from '@/components/shared/OrderStatusBadge/OrderStatusBadge'

describe('OrderStatusBadge', () => {
  describe('status text rendering', () => {
    it('renders "در سبد خرید" for cart status', () => {
      render(<OrderStatusBadge status="cart" />)

      expect(screen.getByText('در سبد خرید')).toBeInTheDocument()
    })

    it('renders "در انتظار پرداخت" for pending status', () => {
      render(<OrderStatusBadge status="pending" />)

      expect(screen.getByText('در انتظار پرداخت')).toBeInTheDocument()
    })

    it('renders "در حال پردازش" for processing status', () => {
      render(<OrderStatusBadge status="processing" />)

      expect(screen.getByText('در حال پردازش')).toBeInTheDocument()
    })

    it('renders "ارسال شده" for shipped status', () => {
      render(<OrderStatusBadge status="shipped" />)

      expect(screen.getByText('ارسال شده')).toBeInTheDocument()
    })

    it('renders "تحویل داده شده" for delivered status', () => {
      render(<OrderStatusBadge status="delivered" />)

      expect(screen.getByText('تحویل داده شده')).toBeInTheDocument()
    })

    it('renders "لغو شده" for canceled status', () => {
      render(<OrderStatusBadge status="canceled" />)

      expect(screen.getByText('لغو شده')).toBeInTheDocument()
    })

    it('renders original status for unknown status', () => {
      render(<OrderStatusBadge status="unknown_status" />)

      expect(screen.getByText('unknown_status')).toBeInTheDocument()
    })
  })

  describe('case insensitivity', () => {
    it('handles uppercase status', () => {
      render(<OrderStatusBadge status="PENDING" />)

      expect(screen.getByText('در انتظار پرداخت')).toBeInTheDocument()
    })

    it('handles mixed case status', () => {
      render(<OrderStatusBadge status="Delivered" />)

      expect(screen.getByText('تحویل داده شده')).toBeInTheDocument()
    })
  })

  describe('icon rendering', () => {
    it('renders icon by default', () => {
      const { container } = render(<OrderStatusBadge status="pending" />)

      const icon = container.querySelector('.icon')
      expect(icon).toBeInTheDocument()
    })

    it('does not render icon when showIcon is false', () => {
      const { container } = render(<OrderStatusBadge status="pending" showIcon={false} />)

      const icon = container.querySelector('.icon')
      expect(icon).not.toBeInTheDocument()
    })

    it('renders box icon for cart status', () => {
      const { container } = render(<OrderStatusBadge status="cart" />)

      const icon = container.querySelector('.icon')
      expect(icon).toBeInTheDocument()
    })

    it('renders box icon for pending status', () => {
      const { container } = render(<OrderStatusBadge status="pending" />)

      const icon = container.querySelector('.icon')
      expect(icon).toBeInTheDocument()
    })

    it('renders box icon for processing status', () => {
      const { container } = render(<OrderStatusBadge status="processing" />)

      const icon = container.querySelector('.icon')
      expect(icon).toBeInTheDocument()
    })

    it('renders truck icon for shipped status', () => {
      const { container } = render(<OrderStatusBadge status="shipped" />)

      const icon = container.querySelector('.icon')
      expect(icon).toBeInTheDocument()
    })

    it('renders check icon for delivered status', () => {
      const { container } = render(<OrderStatusBadge status="delivered" />)

      const icon = container.querySelector('.icon')
      expect(icon).toBeInTheDocument()
    })

    it('renders times icon for canceled status', () => {
      const { container } = render(<OrderStatusBadge status="canceled" />)

      const icon = container.querySelector('.icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('variant styling', () => {
    it('applies pending variant class for cart status', () => {
      const { container } = render(<OrderStatusBadge status="cart" />)

      const badge = container.querySelector('.badge')
      expect(badge?.className).toContain('pending')
    })

    it('applies pending variant class for pending status', () => {
      const { container } = render(<OrderStatusBadge status="pending" />)

      const badge = container.querySelector('.badge')
      expect(badge?.className).toContain('pending')
    })

    it('applies processing variant class for processing status', () => {
      const { container } = render(<OrderStatusBadge status="processing" />)

      const badge = container.querySelector('.badge')
      expect(badge?.className).toContain('processing')
    })

    it('applies shipped variant class for shipped status', () => {
      const { container } = render(<OrderStatusBadge status="shipped" />)

      const badge = container.querySelector('.badge')
      expect(badge?.className).toContain('shipped')
    })

    it('applies delivered variant class for delivered status', () => {
      const { container } = render(<OrderStatusBadge status="delivered" />)

      const badge = container.querySelector('.badge')
      expect(badge?.className).toContain('delivered')
    })

    it('applies canceled variant class for canceled status', () => {
      const { container } = render(<OrderStatusBadge status="canceled" />)

      const badge = container.querySelector('.badge')
      expect(badge?.className).toContain('canceled')
    })

    it('applies pending variant class for unknown status', () => {
      const { container } = render(<OrderStatusBadge status="unknown" />)

      const badge = container.querySelector('.badge')
      expect(badge?.className).toContain('pending')
    })
  })

  describe('badge structure', () => {
    it('renders badge with correct class', () => {
      const { container } = render(<OrderStatusBadge status="pending" />)

      const badge = container.querySelector('.badge')
      expect(badge).toBeInTheDocument()
    })

    it('renders as span element', () => {
      const { container } = render(<OrderStatusBadge status="pending" />)

      const badge = container.querySelector('span.badge')
      expect(badge).toBeInTheDocument()
      expect(badge?.tagName).toBe('SPAN')
    })

    it('contains both icon and text', () => {
      const { container } = render(<OrderStatusBadge status="pending" />)

      const badge = container.querySelector('.badge')
      const icon = badge?.querySelector('.icon')
      const text = badge?.textContent

      expect(icon).toBeInTheDocument()
      expect(text).toContain('در انتظار پرداخت')
    })

    it('contains only text when showIcon is false', () => {
      const { container } = render(<OrderStatusBadge status="pending" showIcon={false} />)

      const badge = container.querySelector('.badge')
      const icon = badge?.querySelector('.icon')

      expect(icon).not.toBeInTheDocument()
      expect(badge?.textContent).toBe('در انتظار پرداخت')
    })
  })

  describe('all status types', () => {
    it('handles all valid status types correctly', () => {
      const statuses: Array<[string, string]> = [
        ['cart', 'در سبد خرید'],
        ['pending', 'در انتظار پرداخت'],
        ['processing', 'در حال پردازش'],
        ['shipped', 'ارسال شده'],
        ['delivered', 'تحویل داده شده'],
        ['canceled', 'لغو شده'],
      ]

      statuses.forEach(([status, expectedText]) => {
        const { unmount } = render(<OrderStatusBadge status={status} />)
        expect(screen.getByText(expectedText)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('visual consistency', () => {
    it('renders consistently with icon', () => {
      const { container } = render(<OrderStatusBadge status="delivered" />)

      const badge = container.querySelector('.badge')
      const icon = container.querySelector('.icon')

      expect(badge).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
      expect(screen.getByText('تحویل داده شده')).toBeInTheDocument()
    })

    it('renders consistently without icon', () => {
      const { container } = render(<OrderStatusBadge status="delivered" showIcon={false} />)

      const badge = container.querySelector('.badge')
      const icon = container.querySelector('.icon')

      expect(badge).toBeInTheDocument()
      expect(icon).not.toBeInTheDocument()
      expect(screen.getByText('تحویل داده شده')).toBeInTheDocument()
    })
  })

  describe('use cases', () => {
    it('renders for order list display', () => {
      render(<OrderStatusBadge status="shipped" />)

      expect(screen.getByText('ارسال شده')).toBeInTheDocument()
    })

    it('renders for order detail page', () => {
      render(<OrderStatusBadge status="delivered" />)

      expect(screen.getByText('تحویل داده شده')).toBeInTheDocument()
    })

    it('renders for admin order management', () => {
      render(<OrderStatusBadge status="processing" />)

      expect(screen.getByText('در حال پردازش')).toBeInTheDocument()
    })

    it('renders for cart status display', () => {
      render(<OrderStatusBadge status="cart" />)

      expect(screen.getByText('در سبد خرید')).toBeInTheDocument()
    })
  })

  describe('integration with utility functions', () => {
    it('uses getOrderStatusText utility correctly', () => {
      render(<OrderStatusBadge status="pending" />)

      // Text should be in Persian as defined by getOrderStatusText
      expect(screen.getByText('در انتظار پرداخت')).toBeInTheDocument()
    })

    it('uses getOrderStatusVariant utility for styling', () => {
      const { container } = render(<OrderStatusBadge status="shipped" />)

      const badge = container.querySelector('.badge')
      // Variant class should be applied as defined by getOrderStatusVariant
      expect(badge?.className).toContain('shipped')
    })

    it('uses getOrderStatusIcon utility for icon selection', () => {
      const { container } = render(<OrderStatusBadge status="canceled" />)

      const icon = container.querySelector('.icon')
      // Icon should be rendered as defined by getOrderStatusIcon
      expect(icon).toBeInTheDocument()
    })
  })
})
