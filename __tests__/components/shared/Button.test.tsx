import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/shared/Button'
import { FaPlus } from 'react-icons/fa'

describe('Button', () => {
  describe('rendering', () => {
    it('renders with text content', () => {
      render(<Button>کلیک کنید</Button>)

      expect(screen.getByRole('button', { name: 'کلیک کنید' })).toBeInTheDocument()
    })

    it('renders as a button element', () => {
      render(<Button>کلیک کنید</Button>)

      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('variants', () => {
    it('renders with primary variant by default', () => {
      const { container } = render(<Button>دکمه اصلی</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('primary')
    })

    it('renders with secondary variant', () => {
      const { container } = render(<Button variant="secondary">دکمه ثانویه</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('secondary')
    })

    it('renders with accent variant', () => {
      const { container } = render(<Button variant="accent">دکمه تاکیدی</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('accent')
    })

    it('renders with outline variant', () => {
      const { container } = render(<Button variant="outline">دکمه خطی</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('outline')
    })
  })

  describe('sizes', () => {
    it('renders with medium size by default', () => {
      const { container } = render(<Button>دکمه متوسط</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('medium')
    })

    it('renders with small size', () => {
      const { container } = render(<Button size="small">دکمه کوچک</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('small')
    })

    it('renders with large size', () => {
      const { container } = render(<Button size="large">دکمه بزرگ</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('large')
    })
  })

  describe('fullWidth prop', () => {
    it('does not apply fullWidth class by default', () => {
      const { container } = render(<Button>دکمه</Button>)

      const button = container.querySelector('button')
      expect(button?.className).not.toContain('fullWidth')
    })

    it('applies fullWidth class when prop is true', () => {
      const { container } = render(<Button fullWidth>دکمه تمام عرض</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('fullWidth')
    })
  })

  describe('rounded prop', () => {
    it('does not apply rounded class by default', () => {
      const { container } = render(<Button>دکمه</Button>)

      const button = container.querySelector('button')
      expect(button?.className).not.toContain('rounded')
    })

    it('applies rounded class when prop is true', () => {
      const { container } = render(<Button rounded>دکمه گرد</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('rounded')
    })
  })

  describe('icon support', () => {
    it('renders without icon by default', () => {
      const { container } = render(<Button>دکمه بدون آیکون</Button>)

      const iconLeft = container.querySelector('.iconLeft')
      const iconRight = container.querySelector('.iconRight')

      expect(iconLeft).not.toBeInTheDocument()
      expect(iconRight).not.toBeInTheDocument()
    })

    it('renders icon on the left by default', () => {
      const { container } = render(
        <Button icon={<FaPlus data-testid="plus-icon" />}>افزودن</Button>
      )

      const iconLeft = container.querySelector('.iconLeft')
      expect(iconLeft).toBeInTheDocument()
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('renders icon on the right when iconPosition is right', () => {
      const { container } = render(
        <Button icon={<FaPlus data-testid="plus-icon" />} iconPosition="right">
          افزودن
        </Button>
      )

      const iconRight = container.querySelector('.iconRight')
      expect(iconRight).toBeInTheDocument()
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('applies withIcon class when icon is present', () => {
      const { container } = render(
        <Button icon={<FaPlus />}>افزودن</Button>
      )

      const button = container.querySelector('button')
      expect(button?.className).toContain('withIcon')
    })
  })

  describe('className prop', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Button className="custom-class">دکمه سفارشی</Button>
      )

      const button = container.querySelector('button')
      expect(button?.className).toContain('custom-class')
    })

    it('preserves default classes when custom className is provided', () => {
      const { container } = render(
        <Button className="custom-class">دکمه</Button>
      )

      const button = container.querySelector('button')
      expect(button?.className).toContain('button')
      expect(button?.className).toContain('primary')
      expect(button?.className).toContain('custom-class')
    })
  })

  describe('user interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>کلیک کنید</Button>)

      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(
        <Button onClick={handleClick} disabled>
          غیرفعال
        </Button>
      )

      await user.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('disabled state', () => {
    it('can be disabled', () => {
      render(<Button disabled>غیرفعال</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('is enabled by default', () => {
      render(<Button>فعال</Button>)

      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('type attribute', () => {
    it('can be set to button', () => {
      render(<Button type="button">دکمه</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('can be set to submit', () => {
      render(<Button type="submit">ارسال</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('can be set to reset', () => {
      render(<Button type="reset">بازنشانی</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })
  })

  describe('accessibility', () => {
    it('supports aria-label', () => {
      render(<Button aria-label="دکمه افزودن محصول">+</Button>)

      const button = screen.getByRole('button', { name: 'دکمه افزودن محصول' })
      expect(button).toBeInTheDocument()
    })

    it('is keyboard accessible', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>کلیک کنید</Button>)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('combined props', () => {
    it('works with multiple props combined', () => {
      const handleClick = jest.fn()
      const { container } = render(
        <Button
          variant="accent"
          size="large"
          fullWidth
          rounded
          icon={<FaPlus data-testid="icon" />}
          iconPosition="right"
          onClick={handleClick}
          className="custom"
        >
          دکمه ترکیبی
        </Button>
      )

      const button = container.querySelector('button')

      // Check classes
      expect(button?.className).toContain('accent')
      expect(button?.className).toContain('large')
      expect(button?.className).toContain('fullWidth')
      expect(button?.className).toContain('rounded')
      expect(button?.className).toContain('withIcon')
      expect(button?.className).toContain('custom')

      // Check icon position
      const iconRight = container.querySelector('.iconRight')
      expect(iconRight).toBeInTheDocument()

      // Check text
      expect(screen.getByText('دکمه ترکیبی')).toBeInTheDocument()
    })
  })
})
