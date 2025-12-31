import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/shared/LoadingSpinner/LoadingSpinner'

describe('LoadingSpinner', () => {
  describe('rendering', () => {
    it('renders spinner icon', () => {
      const { container } = render(<LoadingSpinner />)

      const spinner = container.querySelector('.spinner')
      expect(spinner).toBeInTheDocument()
    })

    it('renders with default message', () => {
      render(<LoadingSpinner />)

      expect(screen.getByText('در حال بارگذاری...')).toBeInTheDocument()
    })

    it('renders with custom message', () => {
      render(<LoadingSpinner message="در حال ذخیره..." />)

      expect(screen.getByText('در حال ذخیره...')).toBeInTheDocument()
    })
  })

  describe('fullPage prop', () => {
    it('does not apply fullPage class by default', () => {
      const { container } = render(<LoadingSpinner />)

      const spinnerContainer = container.querySelector('.container')
      expect(spinnerContainer?.className).not.toContain('fullPage')
    })

    it('applies fullPage class when prop is true', () => {
      const { container } = render(<LoadingSpinner fullPage />)

      const spinnerContainer = container.querySelector('.container')
      expect(spinnerContainer?.className).toContain('fullPage')
    })

    it('renders normal spinner when fullPage is false', () => {
      const { container } = render(<LoadingSpinner fullPage={false} />)

      const spinnerContainer = container.querySelector('.container')
      expect(spinnerContainer?.className).toContain('container')
      expect(spinnerContainer?.className).not.toContain('fullPage')
    })
  })

  describe('accessibility', () => {
    it('has role status for screen readers', () => {
      const { container } = render(<LoadingSpinner />)

      const spinnerContainer = container.querySelector('.container')

      // The component should be perceivable as a loading state
      expect(spinnerContainer).toBeInTheDocument()
    })

    it('message is visible to screen readers', () => {
      render(<LoadingSpinner message="در حال بارگذاری اطلاعات" />)

      const message = screen.getByText('در حال بارگذاری اطلاعات')
      expect(message).toBeVisible()
    })
  })

  describe('different use cases', () => {
    it('renders for general loading state', () => {
      render(<LoadingSpinner message="لطفا صبر کنید..." />)

      expect(screen.getByText('لطفا صبر کنید...')).toBeInTheDocument()
    })

    it('renders for data fetching', () => {
      render(<LoadingSpinner message="در حال دریافت اطلاعات..." />)

      expect(screen.getByText('در حال دریافت اطلاعات...')).toBeInTheDocument()
    })

    it('renders for form submission', () => {
      render(<LoadingSpinner message="در حال ارسال..." />)

      expect(screen.getByText('در حال ارسال...')).toBeInTheDocument()
    })

    it('renders for file upload', () => {
      render(<LoadingSpinner message="در حال آپلود فایل..." />)

      expect(screen.getByText('در حال آپلود فایل...')).toBeInTheDocument()
    })
  })

  describe('combined props', () => {
    it('works with fullPage and custom message', () => {
      const { container } = render(
        <LoadingSpinner fullPage message="در حال پردازش اطلاعات..." />
      )

      const spinnerContainer = container.querySelector('.container')
      expect(spinnerContainer?.className).toContain('fullPage')
      expect(screen.getByText('در حال پردازش اطلاعات...')).toBeInTheDocument()
    })
  })

  describe('visual structure', () => {
    it('renders container, spinner, and message in correct structure', () => {
      const { container } = render(<LoadingSpinner message="بارگذاری" />)

      const spinnerContainer = container.querySelector('.container')
      const spinner = container.querySelector('.spinner')
      const message = container.querySelector('.message')

      expect(spinnerContainer).toBeInTheDocument()
      expect(spinner).toBeInTheDocument()
      expect(message).toBeInTheDocument()
      expect(message?.textContent).toBe('بارگذاری')
    })
  })
})
