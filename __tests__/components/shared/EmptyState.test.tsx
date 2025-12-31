import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmptyState from '@/components/shared/EmptyState/EmptyState'
import { FaShoppingCart, FaInbox, FaSearch, FaHeart, FaFile } from 'react-icons/fa'

describe('EmptyState', () => {
  describe('rendering', () => {
    it('renders icon', () => {
      const { container } = render(
        <EmptyState icon={FaShoppingCart} message="سبد خرید شما خالی است" />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders message', () => {
      render(
        <EmptyState icon={FaShoppingCart} message="سبد خرید شما خالی است" />
      )

      expect(screen.getByText('سبد خرید شما خالی است')).toBeInTheDocument()
    })

    it('renders container with correct class', () => {
      const { container } = render(
        <EmptyState icon={FaShoppingCart} message="پیام" />
      )

      const emptyContainer = container.querySelector('.emptyStateContainer')
      expect(emptyContainer).toBeInTheDocument()
    })
  })

  describe('icon customization', () => {
    it('renders with default icon size of 60', () => {
      const { container } = render(
        <EmptyState icon={FaShoppingCart} message="پیام" />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('height', '60')
    })

    it('renders with custom icon size', () => {
      const { container } = render(
        <EmptyState icon={FaShoppingCart} message="پیام" iconSize={80} />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('height', '80')
    })

    it('renders with small icon size', () => {
      const { container } = render(
        <EmptyState icon={FaInbox} message="پیام" iconSize={40} />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('height', '40')
    })

    it('renders with default icon color', () => {
      const { container } = render(
        <EmptyState icon={FaShoppingCart} message="پیام" />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('color', '#ccc')
    })

    it('renders with custom icon color', () => {
      const { container } = render(
        <EmptyState icon={FaShoppingCart} message="پیام" iconColor="#ff0000" />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('color', '#ff0000')
    })
  })

  describe('action button', () => {
    it('does not render action button by default', () => {
      render(<EmptyState icon={FaShoppingCart} message="خالی است" />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders action button when actionLabel and onAction are provided', () => {
      render(
        <EmptyState
          icon={FaShoppingCart}
          message="سبد خرید خالی است"
          actionLabel="شروع خرید"
          onAction={jest.fn()}
        />
      )

      expect(screen.getByRole('button', { name: 'شروع خرید' })).toBeInTheDocument()
    })

    it('does not render button when only actionLabel is provided', () => {
      render(
        <EmptyState
          icon={FaShoppingCart}
          message="خالی است"
          actionLabel="اقدام"
        />
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('does not render button when only onAction is provided', () => {
      render(
        <EmptyState
          icon={FaShoppingCart}
          message="خالی است"
          onAction={jest.fn()}
        />
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('calls onAction when button is clicked', async () => {
      const onAction = jest.fn()
      const user = userEvent.setup()

      render(
        <EmptyState
          icon={FaShoppingCart}
          message="خالی است"
          actionLabel="اقدام کنید"
          onAction={onAction}
        />
      )

      await user.click(screen.getByRole('button', { name: 'اقدام کنید' }))

      expect(onAction).toHaveBeenCalledTimes(1)
    })

    it('calls onAction multiple times on multiple clicks', async () => {
      const onAction = jest.fn()
      const user = userEvent.setup()

      render(
        <EmptyState
          icon={FaShoppingCart}
          message="خالی است"
          actionLabel="اقدام"
          onAction={onAction}
        />
      )

      const button = screen.getByRole('button')

      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(onAction).toHaveBeenCalledTimes(3)
    })

    it('applies action button class', () => {
      const { container } = render(
        <EmptyState
          icon={FaShoppingCart}
          message="خالی است"
          actionLabel="اقدام"
          onAction={jest.fn()}
        />
      )

      const button = container.querySelector('.actionButton')
      expect(button).toBeInTheDocument()
    })
  })

  describe('different use cases', () => {
    it('renders empty shopping cart state', () => {
      render(
        <EmptyState
          icon={FaShoppingCart}
          message="سبد خرید شما خالی است"
          actionLabel="مشاهده محصولات"
          onAction={jest.fn()}
        />
      )

      expect(screen.getByText('سبد خرید شما خالی است')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'مشاهده محصولات' })).toBeInTheDocument()
    })

    it('renders empty inbox state', () => {
      render(
        <EmptyState
          icon={FaInbox}
          message="پیامی وجود ندارد"
        />
      )

      expect(screen.getByText('پیامی وجود ندارد')).toBeInTheDocument()
    })

    it('renders no search results state', () => {
      render(
        <EmptyState
          icon={FaSearch}
          message="نتیجه‌ای یافت نشد"
          actionLabel="پاک کردن جستجو"
          onAction={jest.fn()}
        />
      )

      expect(screen.getByText('نتیجه‌ای یافت نشد')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'پاک کردن جستجو' })).toBeInTheDocument()
    })

    it('renders empty favorites state', () => {
      render(
        <EmptyState
          icon={FaHeart}
          message="لیست علاقه‌مندی‌های شما خالی است"
          actionLabel="کشف محصولات"
          onAction={jest.fn()}
        />
      )

      expect(screen.getByText('لیست علاقه‌مندی‌های شما خالی است')).toBeInTheDocument()
    })

    it('renders no documents state', () => {
      render(
        <EmptyState
          icon={FaFile}
          message="هیچ سندی موجود نیست"
          actionLabel="افزودن سند"
          onAction={jest.fn()}
        />
      )

      expect(screen.getByText('هیچ سندی موجود نیست')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('action button is keyboard accessible', async () => {
      const onAction = jest.fn()
      const user = userEvent.setup()

      render(
        <EmptyState
          icon={FaShoppingCart}
          message="خالی است"
          actionLabel="اقدام"
          onAction={onAction}
        />
      )

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')
      expect(onAction).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(onAction).toHaveBeenCalledTimes(2)
    })

    it('message is visible to screen readers', () => {
      render(
        <EmptyState
          icon={FaShoppingCart}
          message="سبد خرید خالی است"
        />
      )

      const message = screen.getByText('سبد خرید خالی است')
      expect(message).toBeVisible()
    })
  })

  describe('combined props', () => {
    it('works with all props combined', async () => {
      const onAction = jest.fn()
      const user = userEvent.setup()
      const { container } = render(
        <EmptyState
          icon={FaShoppingCart}
          message="سبد خرید خالی است"
          actionLabel="شروع خرید"
          onAction={onAction}
          iconSize={100}
          iconColor="#00ff00"
        />
      )

      // Check message
      expect(screen.getByText('سبد خرید خالی است')).toBeInTheDocument()

      // Check icon size and color
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('height', '100')
      expect(svg).toHaveAttribute('color', '#00ff00')

      // Check button
      const button = screen.getByRole('button', { name: 'شروع خرید' })
      expect(button).toBeInTheDocument()

      // Check button functionality
      await user.click(button)
      expect(onAction).toHaveBeenCalledTimes(1)
    })
  })

  describe('message styling', () => {
    it('applies message class', () => {
      const { container } = render(
        <EmptyState icon={FaShoppingCart} message="پیام" />
      )

      const message = container.querySelector('.message')
      expect(message).toBeInTheDocument()
      expect(message?.textContent).toBe('پیام')
    })
  })

  describe('different icon types', () => {
    it('works with different icon components', () => {
      const icons = [FaShoppingCart, FaInbox, FaSearch, FaHeart, FaFile]

      icons.forEach((Icon) => {
        const { container } = render(
          <EmptyState icon={Icon} message="تست" />
        )

        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })
  })
})
