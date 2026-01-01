import { userService } from '@/services/userService'
import api from '@/services/api'
import Cookies from 'js-cookie'

// Mock dependencies
jest.mock('@/services/api')
jest.mock('js-cookie')

const mockApi = api as jest.Mocked<typeof api>
const mockCookies = Cookies as jest.Mocked<typeof Cookies>

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('getCurrentUser', () => {
    it('fetches current user successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        first_name: 'علی',
        last_name: 'محمدی',
        phone: '09121234567',
        is_staff: false,
        profile_image: null,
        address: null,
      }

      mockApi.get.mockResolvedValue({ data: mockUser })

      const result = await userService.getCurrentUser()

      expect(mockApi.get).toHaveBeenCalledWith('/users/me/')
      expect(result).toEqual(mockUser)
    })

    it('throws error when request fails', async () => {
      mockApi.get.mockRejectedValue(new Error('Unauthorized'))

      await expect(userService.getCurrentUser()).rejects.toThrow('Unauthorized')
    })
  })

  describe('updateProfile', () => {
    it('updates user profile successfully', async () => {
      const updateData = {
        first_name: 'رضا',
        last_name: 'احمدی',
      }

      const updatedUser = {
        id: 'user-1',
        email: 'test@example.com',
        ...updateData,
        is_staff: false,
      }

      mockApi.patch.mockResolvedValue({ data: updatedUser })

      const result = await userService.updateProfile(updateData)

      expect(mockApi.patch).toHaveBeenCalledWith('/users/me/', updateData)
      expect(result).toEqual(updatedUser)
    })

    it('updates phone number', async () => {
      const updateData = { phone: '09129876543' }

      mockApi.patch.mockResolvedValue({ data: { phone: '09129876543' } })

      await userService.updateProfile(updateData)

      expect(mockApi.patch).toHaveBeenCalledWith('/users/me/', updateData)
    })
  })

  describe('getAddresses', () => {
    it('fetches user addresses successfully', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 'addr-1',
            full_name: 'علی محمدی',
            phone_number: '09121234567',
            province: 'تهران',
            city: 'تهران',
            postal_code: '1234567890',
            address: 'خیابان ولیعصر',
          },
          {
            id: 'addr-2',
            full_name: 'علی محمدی',
            phone_number: '09121234567',
            province: 'اصفهان',
            city: 'اصفهان',
            postal_code: '9876543210',
            address: 'خیابان چهارباغ',
          },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockResponse })

      const result = await userService.getAddresses()

      expect(mockApi.get).toHaveBeenCalledWith('/users/addresses/')
      expect(result).toEqual(mockResponse)
      expect(result.results).toHaveLength(2)
    })
  })

  describe('addAddress', () => {
    it('adds new address successfully', async () => {
      const newAddress = {
        full_name: 'علی محمدی',
        phone_number: '09121234567',
        province: 'تهران',
        city: 'تهران',
        postal_code: '1234567890',
        address: 'خیابان آزادی',
      }

      const createdAddress = {
        id: 'addr-3',
        ...newAddress,
      }

      mockApi.post.mockResolvedValue({ data: createdAddress })

      const result = await userService.addAddress(newAddress)

      expect(mockApi.post).toHaveBeenCalledWith('/users/addresses/', newAddress)
      expect(result).toEqual(createdAddress)
    })
  })

  describe('updateAddress', () => {
    it('updates existing address successfully', async () => {
      const addressId = 'addr-1'
      const updateData = {
        full_name: 'علی محمدی',
        phone_number: '09121234567',
        province: 'تهران',
        city: 'کرج',
        postal_code: '1234567890',
        address: 'خیابان مطهری',
      }

      const updatedAddress = {
        id: addressId,
        ...updateData,
      }

      mockApi.put.mockResolvedValue({ data: updatedAddress })

      const result = await userService.updateAddress(addressId, updateData)

      expect(mockApi.put).toHaveBeenCalledWith(
        `/users/addresses/${addressId}/`,
        updateData
      )
      expect(result).toEqual(updatedAddress)
    })
  })

  describe('deleteAddress', () => {
    it('deletes address successfully', async () => {
      const addressId = 'addr-1'

      mockApi.delete.mockResolvedValue({ data: {} })

      await userService.deleteAddress(addressId)

      expect(mockApi.delete).toHaveBeenCalledWith(`/users/addresses/${addressId}/`)
    })
  })

  describe('setDefaultAddress', () => {
    it('sets default address successfully', async () => {
      const addressId = 'addr-1'
      const response = { success: true }

      mockApi.post.mockResolvedValue({ data: response })

      const result = await userService.setDefaultAddress(addressId)

      expect(mockApi.post).toHaveBeenCalledWith(
        `/users/addresses/${addressId}/set_default/`
      )
      expect(result).toEqual(response)
    })
  })

  describe('getOrders', () => {
    it('fetches user orders with default pagination', async () => {
      const mockOrders = {
        count: 5,
        next: null,
        previous: null,
        results: [
          {
            id: 'order-1',
            status: 'delivered',
            total_price: '500000',
            items: [],
          },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockOrders })

      const result = await userService.getOrders()

      expect(mockApi.get).toHaveBeenCalledWith('/shop/orders/?page=1&limit=10')
      expect(result).toEqual(mockOrders)
    })

    it('fetches user orders with custom pagination', async () => {
      const mockOrders = {
        count: 20,
        next: 'next-url',
        previous: null,
        results: [],
      }

      mockApi.get.mockResolvedValue({ data: mockOrders })

      await userService.getOrders(2, 20)

      expect(mockApi.get).toHaveBeenCalledWith('/shop/orders/?page=2&limit=20')
    })
  })

  describe('getOrderDetails', () => {
    it('fetches order details successfully', async () => {
      const orderId = 'order-1'
      const mockOrder = {
        id: orderId,
        status: 'processing',
        total_price: '300000',
        items: [
          {
            id: 'item-1',
            product: {
              id: 'prod-1',
              title: 'محصول تست',
              price: '100000',
            },
            quantity: 3,
            total_price: '300000',
          },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockOrder })

      const result = await userService.getOrderDetails(orderId)

      expect(mockApi.get).toHaveBeenCalledWith(`/shop/orders/${orderId}/`)
      expect(result).toEqual(mockOrder)
    })
  })

  describe('uploadProfileImage', () => {
    it('uploads profile image successfully', async () => {
      const imageFile = new File(['image'], 'profile.jpg', { type: 'image/jpeg' })
      const mockUser = {
        id: 'user-1',
        profile_image: 'https://example.com/images/profile.jpg',
      }

      mockApi.post.mockResolvedValue({ data: mockUser })

      const result = await userService.uploadProfileImage(imageFile)

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[0]).toBe('/users/me/profile-image/')
      expect(callArgs[1]).toBeInstanceOf(FormData)
      expect(callArgs[2]).toEqual({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      expect(result).toEqual(mockUser)
    })
  })

  describe('deleteProfileImage', () => {
    it('deletes profile image successfully', async () => {
      const mockUser = {
        id: 'user-1',
        profile_image: null,
      }

      mockApi.delete.mockResolvedValue({ data: mockUser })

      const result = await userService.deleteProfileImage()

      expect(mockApi.delete).toHaveBeenCalledWith('/users/me/profile-image/')
      expect(result).toEqual(mockUser)
      expect(result.profile_image).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('returns true when access token is in localStorage', () => {
      localStorage.setItem('access_token', 'mock-token')

      const result = userService.isAuthenticated()

      expect(result).toBe(true)
    })

    it('returns true when access token is in cookies', () => {
      mockCookies.get.mockReturnValue('mock-token')

      const result = userService.isAuthenticated()

      expect(result).toBe(true)
    })

    it('returns false when no access token exists', () => {
      mockCookies.get.mockReturnValue(undefined)

      const result = userService.isAuthenticated()

      expect(result).toBe(false)
    })

    it('returns true when token exists in cookie on server side', () => {
      // Simulate server-side rendering by making window undefined
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      mockCookies.get.mockReturnValue('mock-token')

      const result = userService.isAuthenticated()

      expect(result).toBe(true)

      // Restore window
      global.window = originalWindow
    })
  })

  describe('logout', () => {
    it('clears all tokens and user data', () => {
      localStorage.setItem('access_token', 'access-token')
      localStorage.setItem('refresh_token', 'refresh-token')
      localStorage.setItem('user', JSON.stringify({ id: '1' }))

      userService.logout()

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(mockCookies.remove).toHaveBeenCalledWith('access_token')
      expect(api.defaults.headers.common['Authorization']).toBeUndefined()
    })

    it('works on server side without window', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      expect(() => userService.logout()).not.toThrow()

      expect(mockCookies.remove).toHaveBeenCalledWith('access_token')

      // Restore window
      global.window = originalWindow
    })
  })
})
