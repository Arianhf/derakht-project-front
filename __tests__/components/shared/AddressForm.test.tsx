import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddressForm } from '@/components/shared/AddressForm/AddressForm'
import type { AddressFormData } from '@/components/shared/AddressForm/AddressForm'

describe('AddressForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders all form fields', () => {
      render(<AddressForm onSubmit={mockOnSubmit} />)

      expect(screen.getByLabelText(/نام و نام خانوادگی/)).toBeInTheDocument()
      expect(screen.getByLabelText(/شماره تماس/)).toBeInTheDocument()
      expect(screen.getByLabelText(/استان/)).toBeInTheDocument()
      expect(screen.getByLabelText(/شهر/)).toBeInTheDocument()
      expect(screen.getByLabelText(/آدرس کامل/)).toBeInTheDocument()
      expect(screen.getByLabelText(/کد پستی/)).toBeInTheDocument()
    })

    it('renders submit button with default label', () => {
      render(<AddressForm onSubmit={mockOnSubmit} />)

      expect(screen.getByRole('button', { name: 'ادامه' })).toBeInTheDocument()
    })

    it('renders submit button with custom label', () => {
      render(<AddressForm onSubmit={mockOnSubmit} submitLabel="ذخیره" />)

      expect(screen.getByRole('button', { name: 'ذخیره' })).toBeInTheDocument()
    })

    it('does not render cancel button by default', () => {
      render(<AddressForm onSubmit={mockOnSubmit} />)

      expect(screen.queryByRole('button', { name: 'انصراف' })).not.toBeInTheDocument()
    })

    it('renders cancel button when showCancelButton is true', () => {
      render(
        <AddressForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          showCancelButton
        />
      )

      expect(screen.getByRole('button', { name: 'انصراف' })).toBeInTheDocument()
    })

    it('renders cancel button with custom label', () => {
      render(
        <AddressForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          showCancelButton
          cancelLabel="بستن"
        />
      )

      expect(screen.getByRole('button', { name: 'بستن' })).toBeInTheDocument()
    })
  })

  describe('initial data', () => {
    it('renders with empty fields by default', () => {
      render(<AddressForm onSubmit={mockOnSubmit} />)

      expect(screen.getByLabelText(/نام و نام خانوادگی/)).toHaveValue('')
      expect(screen.getByLabelText(/شماره تماس/)).toHaveValue('')
      expect(screen.getByLabelText(/شهر/)).toHaveValue('')
      expect(screen.getByLabelText(/آدرس کامل/)).toHaveValue('')
      expect(screen.getByLabelText(/کد پستی/)).toHaveValue('')
    })

    it('renders with initial data', () => {
      const initialData: Partial<AddressFormData> = {
        fullName: 'علی احمدی',
        phoneNumber: '09121234567',
        province: 'تهران',
        city: 'تهران',
        address: 'خیابان ولیعصر',
        postalCode: '1234567890',
      }

      render(<AddressForm onSubmit={mockOnSubmit} initialData={initialData} />)

      expect(screen.getByLabelText(/نام و نام خانوادگی/)).toHaveValue('علی احمدی')
      expect(screen.getByLabelText(/شماره تماس/)).toHaveValue('09121234567')
      expect(screen.getByLabelText(/شهر/)).toHaveValue('تهران')
      expect(screen.getByLabelText(/آدرس کامل/)).toHaveValue('خیابان ولیعصر')
      expect(screen.getByLabelText(/کد پستی/)).toHaveValue('1234567890')
    })

    it('renders with partial initial data', () => {
      const initialData: Partial<AddressFormData> = {
        fullName: 'محمد رضایی',
        city: 'شیراز',
      }

      render(<AddressForm onSubmit={mockOnSubmit} initialData={initialData} />)

      expect(screen.getByLabelText(/نام و نام خانوادگی/)).toHaveValue('محمد رضایی')
      expect(screen.getByLabelText(/شهر/)).toHaveValue('شیراز')
      expect(screen.getByLabelText(/شماره تماس/)).toHaveValue('')
    })
  })

  describe('form validation', () => {
    it('shows error when fullName is empty', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('لطفا نام و نام خانوادگی را وارد کنید')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('shows error when address is empty', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('لطفا آدرس را وارد کنید')).toBeInTheDocument()
    })

    it('shows error when city is empty', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('لطفا شهر را وارد کنید')).toBeInTheDocument()
    })

    it('shows error when province is empty', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('لطفا استان را انتخاب کنید')).toBeInTheDocument()
    })

    it('shows error when postalCode is empty', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('لطفا کد پستی را وارد کنید')).toBeInTheDocument()
    })

    it('shows error when postalCode is invalid', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/کد پستی/), '12345')
      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('کد پستی باید 10 رقم باشد')).toBeInTheDocument()
    })

    it('shows error when phoneNumber is empty', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('لطفا شماره تماس را وارد کنید')).toBeInTheDocument()
    })

    it('shows error when phoneNumber is invalid', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/شماره تماس/), '123456789')
      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(
        await screen.findByText('شماره تماس باید با 09 شروع شود و 11 رقم باشد')
      ).toBeInTheDocument()
    })

    it('shows all validation errors when form is empty', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      await waitFor(() => {
        expect(screen.getByText('لطفا نام و نام خانوادگی را وارد کنید')).toBeInTheDocument()
        expect(screen.getByText('لطفا آدرس را وارد کنید')).toBeInTheDocument()
        expect(screen.getByText('لطفا شهر را وارد کنید')).toBeInTheDocument()
        expect(screen.getByText('لطفا استان را انتخاب کنید')).toBeInTheDocument()
        expect(screen.getByText('لطفا کد پستی را وارد کنید')).toBeInTheDocument()
        expect(screen.getByText('لطفا شماره تماس را وارد کنید')).toBeInTheDocument()
      })
    })
  })

  describe('error clearing', () => {
    it('clears fullName error when user types', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: 'ادامه' }))
      expect(await screen.findByText('لطفا نام و نام خانوادگی را وارد کنید')).toBeInTheDocument()

      await user.type(screen.getByLabelText(/نام و نام خانوادگی/), 'علی')

      await waitFor(() => {
        expect(screen.queryByText('لطفا نام و نام خانوادگی را وارد کنید')).not.toBeInTheDocument()
      })
    })

    it('clears postalCode error when user types valid code', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/کد پستی/), '123')
      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('کد پستی باید 10 رقم باشد')).toBeInTheDocument()

      await user.clear(screen.getByLabelText(/کد پستی/))
      await user.type(screen.getByLabelText(/کد پستی/), '1')

      await waitFor(() => {
        expect(screen.queryByText('کد پستی باید 10 رقم باشد')).not.toBeInTheDocument()
      })
    })
  })

  describe('form submission', () => {
    it('calls onSubmit with form data when valid', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/نام و نام خانوادگی/), 'علی احمدی')
      await user.type(screen.getByLabelText(/شماره تماس/), '09121234567')

      const provinceSelect = screen.getByLabelText(/استان/)
      await user.selectOptions(provinceSelect, 'تهران')

      await user.type(screen.getByLabelText(/شهر/), 'تهران')
      await user.type(screen.getByLabelText(/آدرس کامل/), 'خیابان ولیعصر')
      await user.type(screen.getByLabelText(/کد پستی/), '1234567890')

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          fullName: 'علی احمدی',
          phoneNumber: '09121234567',
          province: 'تهران',
          city: 'تهران',
          address: 'خیابان ولیعصر',
          postalCode: '1234567890',
        })
      })
    })

    it('does not call onSubmit when form has errors', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/نام و نام خانوادگی/), 'علی احمدی')
      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })
  })

  describe('cancel button', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <AddressForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          showCancelButton
        />
      )

      await user.click(screen.getByRole('button', { name: 'انصراف' }))

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('does not submit form when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <AddressForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          showCancelButton
        />
      )

      await user.click(screen.getByRole('button', { name: 'انصراف' }))

      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  describe('phone number validation', () => {
    it('accepts valid Iranian mobile numbers', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/نام و نام خانوادگی/), 'علی')
      await user.type(screen.getByLabelText(/شماره تماس/), '09121234567')
      const provinceSelect = screen.getByLabelText(/استان/)
      await user.selectOptions(provinceSelect, 'تهران')
      await user.type(screen.getByLabelText(/شهر/), 'تهران')
      await user.type(screen.getByLabelText(/آدرس کامل/), 'تهران')
      await user.type(screen.getByLabelText(/کد پستی/), '1234567890')

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('rejects phone numbers not starting with 09', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/شماره تماس/), '01234567890')
      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(
        await screen.findByText('شماره تماس باید با 09 شروع شود و 11 رقم باشد')
      ).toBeInTheDocument()
    })
  })

  describe('postal code validation', () => {
    it('accepts valid 10-digit postal codes', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/نام و نام خانوادگی/), 'علی')
      await user.type(screen.getByLabelText(/شماره تماس/), '09121234567')
      const provinceSelect = screen.getByLabelText(/استان/)
      await user.selectOptions(provinceSelect, 'تهران')
      await user.type(screen.getByLabelText(/شهر/), 'تهران')
      await user.type(screen.getByLabelText(/آدرس کامل/), 'تهران')
      await user.type(screen.getByLabelText(/کد پستی/), '1234567890')

      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('rejects postal codes with less than 10 digits', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/کد پستی/), '123456789')
      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('کد پستی باید 10 رقم باشد')).toBeInTheDocument()
    })

    it('rejects postal codes with more than 10 digits', async () => {
      const user = userEvent.setup()
      render(<AddressForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/کد پستی/), '12345678901')
      await user.click(screen.getByRole('button', { name: 'ادامه' }))

      expect(await screen.findByText('کد پستی باید 10 رقم باشد')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('associates labels with form fields', () => {
      render(<AddressForm onSubmit={mockOnSubmit} />)

      const fullNameInput = screen.getByLabelText(/نام و نام خانوادگی/)
      const phoneInput = screen.getByLabelText(/شماره تماس/)
      const cityInput = screen.getByLabelText(/شهر/)
      const addressInput = screen.getByLabelText(/آدرس کامل/)
      const postalCodeInput = screen.getByLabelText(/کد پستی/)

      expect(fullNameInput).toBeInTheDocument()
      expect(phoneInput).toBeInTheDocument()
      expect(cityInput).toBeInTheDocument()
      expect(addressInput).toBeInTheDocument()
      expect(postalCodeInput).toBeInTheDocument()
    })
  })
})
