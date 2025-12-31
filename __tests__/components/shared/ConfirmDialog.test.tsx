import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from '@/components/shared/ConfirmDialog/ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <ConfirmDialog
          isOpen={false}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('renders dialog when isOpen is true', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="تایید حذف"
          message="آیا مطمئن هستید؟"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('تایید حذف')).toBeInTheDocument()
        expect(screen.getByText('آیا مطمئن هستید؟')).toBeInTheDocument()
      })
    })

    it('renders title correctly', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="تایید عملیات"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('تایید عملیات')).toBeInTheDocument()
      })
    })

    it('renders message correctly', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="این عملیات قابل بازگشت نیست"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('این عملیات قابل بازگشت نیست')).toBeInTheDocument()
      })
    })
  })

  describe('buttons', () => {
    it('renders confirm button with default text', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'تایید' })).toBeInTheDocument()
      })
    })

    it('renders cancel button with default text', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'انصراف' })).toBeInTheDocument()
      })
    })

    it('renders confirm button with custom text', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          confirmText="حذف"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'حذف' })).toBeInTheDocument()
      })
    })

    it('renders cancel button with custom text', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          cancelText="بستن"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'بستن' })).toBeInTheDocument()
      })
    })
  })

  describe('interactions', () => {
    it('calls onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'تایید' })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: 'تایید' }))

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'انصراف' })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: 'انصراف' }))

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('provides overlay for background clicks', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('عنوان')).toBeInTheDocument()
      })

      const overlay = document.body.querySelector('.overlay')
      expect(overlay).toBeInTheDocument()
    })
  })

  describe('body scroll lock', () => {
    it('locks body scroll when dialog opens', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })
    })

    it('unlocks body scroll when dialog closes', async () => {
      const { rerender } = render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })

      rerender(
        <ConfirmDialog
          isOpen={false}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('unset')
      })
    })

    it('restores body scroll on unmount', async () => {
      const { unmount } = render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })

      unmount()

      expect(document.body.style.overflow).toBe('unset')
    })
  })

  describe('use cases', () => {
    it('renders delete confirmation dialog', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="تایید حذف"
          message="آیا از حذف این مورد اطمینان دارید؟"
          confirmText="حذف"
          cancelText="انصراف"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('تایید حذف')).toBeInTheDocument()
        expect(screen.getByText('آیا از حذف این مورد اطمینان دارید؟')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'حذف' })).toBeInTheDocument()
      })
    })

    it('renders logout confirmation dialog', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="خروج از حساب کاربری"
          message="آیا می‌خواهید از حساب کاربری خود خارج شوید؟"
          confirmText="خروج"
          cancelText="انصراف"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('خروج از حساب کاربری')).toBeInTheDocument()
        expect(screen.getByText('آیا می‌خواهید از حساب کاربری خود خارج شوید؟')).toBeInTheDocument()
      })
    })

    it('renders cancel order confirmation dialog', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="لغو سفارش"
          message="آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟"
          confirmText="تایید لغو"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'لغو سفارش' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'تایید لغو' })).toBeInTheDocument()
        expect(screen.getByText('آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟')).toBeInTheDocument()
      })
    })
  })

  describe('portal rendering', () => {
    it('renders dialog at document.body level', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        const overlay = document.body.querySelector('.overlay')
        expect(overlay).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('has proper heading structure', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="تایید عملیات"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: 'تایید عملیات' })
        expect(heading).toBeInTheDocument()
        expect(heading.tagName).toBe('H3')
      })
    })

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'تایید' })).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: 'تایید' })
      confirmButton.focus()

      await user.keyboard('{Enter}')
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })
  })

  describe('state transitions', () => {
    it('transitions from closed to open', async () => {
      const { rerender } = render(
        <ConfirmDialog
          isOpen={false}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.queryByText('عنوان')).not.toBeInTheDocument()

      rerender(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('عنوان')).toBeInTheDocument()
      })
    })

    it('transitions from open to closed', async () => {
      const { rerender } = render(
        <ConfirmDialog
          isOpen={true}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('عنوان')).toBeInTheDocument()
      })

      rerender(
        <ConfirmDialog
          isOpen={false}
          title="عنوان"
          message="پیام"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.queryByText('عنوان')).not.toBeInTheDocument()
      })
    })
  })
})
