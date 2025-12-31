import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '@/components/shared/Pagination/Pagination'

describe('Pagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders nothing when totalPages is 1', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when totalPages is 0', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={mockOnPageChange}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('renders pagination when totalPages is greater than 1', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      expect(screen.getByRole('button', { name: 'قبلی' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'بعدی' })).toBeInTheDocument()
    })

    it('renders page numbers in Persian', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      )

      expect(screen.getByRole('button', { name: '۱' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۲' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۳' })).toBeInTheDocument()
    })
  })

  describe('previous button', () => {
    it('is disabled on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const prevButton = screen.getByRole('button', { name: 'قبلی' })
      expect(prevButton).toBeDisabled()
    })

    it('is enabled when not on first page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const prevButton = screen.getByRole('button', { name: 'قبلی' })
      expect(prevButton).not.toBeDisabled()
    })

    it('calls onPageChange with previous page when clicked', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'قبلی' }))

      expect(mockOnPageChange).toHaveBeenCalledWith(2)
    })

    it('does not call onPageChange when disabled', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'قبلی' }))

      expect(mockOnPageChange).not.toHaveBeenCalled()
    })
  })

  describe('next button', () => {
    it('is disabled on last page', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const nextButton = screen.getByRole('button', { name: 'بعدی' })
      expect(nextButton).toBeDisabled()
    })

    it('is enabled when not on last page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const nextButton = screen.getByRole('button', { name: 'بعدی' })
      expect(nextButton).not.toBeDisabled()
    })

    it('calls onPageChange with next page when clicked', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'بعدی' }))

      expect(mockOnPageChange).toHaveBeenCalledWith(4)
    })

    it('does not call onPageChange when disabled', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'بعدی' }))

      expect(mockOnPageChange).not.toHaveBeenCalled()
    })
  })

  describe('page number buttons', () => {
    it('calls onPageChange with clicked page number', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      await user.click(screen.getByRole('button', { name: '۳' }))

      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('applies active class to current page', () => {
      const { container } = render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const page3Button = screen.getByRole('button', { name: '۳' })
      expect(page3Button.className).toContain('active')
    })

    it('does not apply active class to non-current pages', () => {
      const { container } = render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const page2Button = screen.getByRole('button', { name: '۲' })
      expect(page2Button.className).not.toContain('active')
    })
  })

  describe('maxVisible prop', () => {
    it('uses default maxVisible of 5', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      )

      // Should show pages 1-5
      expect(screen.getByRole('button', { name: '۱' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۵' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '۶' })).not.toBeInTheDocument()
    })

    it('respects custom maxVisible value', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          maxVisible={3}
          onPageChange={mockOnPageChange}
        />
      )

      // Should show pages 1-3
      expect(screen.getByRole('button', { name: '۱' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۳' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '۴' })).not.toBeInTheDocument()
    })

    it('centers current page when in middle', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          maxVisible={5}
          onPageChange={mockOnPageChange}
        />
      )

      // Should show pages 3-7 (5 in center)
      expect(screen.getByRole('button', { name: '۳' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۷' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '۲' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '۸' })).not.toBeInTheDocument()
    })

    it('adjusts range when near the end', () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          maxVisible={5}
          onPageChange={mockOnPageChange}
        />
      )

      // Should show pages 6-10
      expect(screen.getByRole('button', { name: '۶' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۱۰' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '۵' })).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles 2 total pages correctly', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />
      )

      expect(screen.getByRole('button', { name: '۱' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۲' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'قبلی' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'بعدی' })).not.toBeDisabled()
    })

    it('handles totalPages less than maxVisible', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          maxVisible={5}
          onPageChange={mockOnPageChange}
        />
      )

      // Should show all 3 pages
      expect(screen.getByRole('button', { name: '۱' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۲' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۳' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '۴' })).not.toBeInTheDocument()
    })

    it('handles currentPage at start boundary', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={20}
          maxVisible={5}
          onPageChange={mockOnPageChange}
        />
      )

      expect(screen.getByRole('button', { name: '۱' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۵' })).toBeInTheDocument()
    })

    it('handles currentPage at end boundary', () => {
      render(
        <Pagination
          currentPage={20}
          totalPages={20}
          maxVisible={5}
          onPageChange={mockOnPageChange}
        />
      )

      expect(screen.getByRole('button', { name: '۱۶' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '۲۰' })).toBeInTheDocument()
    })
  })

  describe('navigation flow', () => {
    it('navigates through pages sequentially', async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      // Go to page 2
      await user.click(screen.getByRole('button', { name: 'بعدی' }))
      expect(mockOnPageChange).toHaveBeenCalledWith(2)

      // Simulate page change
      rerender(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      // Go to page 3
      await user.click(screen.getByRole('button', { name: 'بعدی' }))
      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('allows jumping to specific page', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      )

      await user.click(screen.getByRole('button', { name: '۵' }))

      expect(mockOnPageChange).toHaveBeenCalledWith(5)
    })
  })

  describe('accessibility', () => {
    it('all buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const nextButton = screen.getByRole('button', { name: 'بعدی' })
      nextButton.focus()

      await user.keyboard('{Enter}')
      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('disabled buttons cannot be activated via keyboard', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const prevButton = screen.getByRole('button', { name: 'قبلی' })
      prevButton.focus()

      await user.keyboard('{Enter}')
      expect(mockOnPageChange).not.toHaveBeenCalled()
    })
  })

  describe('multiple clicks', () => {
    it('handles rapid page changes', async () => {
      const user = userEvent.setup()
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      )

      const nextButton = screen.getByRole('button', { name: 'بعدی' })

      await user.click(nextButton)
      await user.click(nextButton)
      await user.click(nextButton)

      // Each click should call with page 2 (since we don't update currentPage in test)
      expect(mockOnPageChange).toHaveBeenCalledTimes(3)
      expect(mockOnPageChange).toHaveBeenCalledWith(2)
    })
  })
})
