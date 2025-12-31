import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from '@/components/shared/ErrorMessage/ErrorMessage'

describe('ErrorMessage', () => {
  describe('rendering', () => {
    it('renders error message text', () => {
      render(<ErrorMessage message="خطا در بارگذاری اطلاعات" />)

      expect(screen.getByText('خطا در بارگذاری اطلاعات')).toBeInTheDocument()
    })

    it('renders container with correct class', () => {
      const { container } = render(<ErrorMessage message="خطا" />)

      const errorContainer = container.querySelector('.container')
      expect(errorContainer).toBeInTheDocument()
    })

    it('renders message with correct class', () => {
      const { container } = render(<ErrorMessage message="خطا" />)

      const message = container.querySelector('.message')
      expect(message).toBeInTheDocument()
      expect(message?.textContent).toBe('خطا')
    })
  })

  describe('retry functionality', () => {
    it('does not render retry button by default', () => {
      render(<ErrorMessage message="خطا" />)

      const retryButton = screen.queryByRole('button', { name: 'تلاش مجدد' })
      expect(retryButton).not.toBeInTheDocument()
    })

    it('renders retry button when onRetry is provided', () => {
      render(<ErrorMessage message="خطا" onRetry={jest.fn()} />)

      expect(screen.getByRole('button', { name: 'تلاش مجدد' })).toBeInTheDocument()
    })

    it('calls onRetry when retry button is clicked', async () => {
      const onRetry = jest.fn()
      const user = userEvent.setup()

      render(<ErrorMessage message="خطا" onRetry={onRetry} />)

      await user.click(screen.getByRole('button', { name: 'تلاش مجدد' }))

      expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('calls onRetry multiple times on multiple clicks', async () => {
      const onRetry = jest.fn()
      const user = userEvent.setup()

      render(<ErrorMessage message="خطا" onRetry={onRetry} />)

      const retryButton = screen.getByRole('button', { name: 'تلاش مجدد' })

      await user.click(retryButton)
      await user.click(retryButton)
      await user.click(retryButton)

      expect(onRetry).toHaveBeenCalledTimes(3)
    })
  })

  describe('different error messages', () => {
    it('renders network error message', () => {
      render(<ErrorMessage message="خطا در اتصال به سرور" />)

      expect(screen.getByText('خطا در اتصال به سرور')).toBeInTheDocument()
    })

    it('renders validation error message', () => {
      render(<ErrorMessage message="اطلاعات وارد شده نامعتبر است" />)

      expect(screen.getByText('اطلاعات وارد شده نامعتبر است')).toBeInTheDocument()
    })

    it('renders authentication error message', () => {
      render(<ErrorMessage message="دسترسی غیرمجاز" />)

      expect(screen.getByText('دسترسی غیرمجاز')).toBeInTheDocument()
    })

    it('renders not found error message', () => {
      render(<ErrorMessage message="صفحه مورد نظر یافت نشد" />)

      expect(screen.getByText('صفحه مورد نظر یافت نشد')).toBeInTheDocument()
    })

    it('renders generic error message', () => {
      render(<ErrorMessage message="خطایی رخ داده است" />)

      expect(screen.getByText('خطایی رخ داده است')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('retry button is keyboard accessible', async () => {
      const onRetry = jest.fn()
      const user = userEvent.setup()

      render(<ErrorMessage message="خطا" onRetry={onRetry} />)

      const retryButton = screen.getByRole('button', { name: 'تلاش مجدد' })
      retryButton.focus()

      await user.keyboard('{Enter}')
      expect(onRetry).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(onRetry).toHaveBeenCalledTimes(2)
    })

    it('error message is visible to screen readers', () => {
      render(<ErrorMessage message="خطا در بارگذاری" />)

      const message = screen.getByText('خطا در بارگذاری')
      expect(message).toBeVisible()
    })
  })

  describe('button styling', () => {
    it('applies retry button class when button is rendered', () => {
      const { container } = render(<ErrorMessage message="خطا" onRetry={jest.fn()} />)

      const retryButton = container.querySelector('.retryButton')
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('component integration scenarios', () => {
    it('can be used for API fetch errors', async () => {
      const handleRetry = jest.fn()
      const user = userEvent.setup()

      render(
        <ErrorMessage
          message="خطا در دریافت اطلاعات از سرور"
          onRetry={handleRetry}
        />
      )

      expect(screen.getByText('خطا در دریافت اطلاعات از سرور')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'تلاش مجدد' }))

      expect(handleRetry).toHaveBeenCalled()
    })

    it('can be used for form submission errors without retry', () => {
      render(<ErrorMessage message="خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید" />)

      expect(
        screen.getByText('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید')
      ).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('can be used for image upload errors with retry', async () => {
      const handleRetry = jest.fn()
      const user = userEvent.setup()

      render(
        <ErrorMessage
          message="خطا در آپلود تصویر"
          onRetry={handleRetry}
        />
      )

      await user.click(screen.getByRole('button', { name: 'تلاش مجدد' }))

      expect(handleRetry).toHaveBeenCalled()
    })
  })

  describe('long error messages', () => {
    it('renders long error message correctly', () => {
      const longMessage =
        'متاسفانه خطایی در پردازش درخواست شما رخ داده است. لطفا اتصال اینترنت خود را بررسی کنید و مجددا تلاش کنید'

      render(<ErrorMessage message={longMessage} />)

      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })
  })
})
