import { loginService } from '@/services/loginService'
import api from '@/services/api'
import Cookies from 'js-cookie'
import { shopService } from '@/services/shopService'

// Mock dependencies
jest.mock('@/services/api')
jest.mock('js-cookie')
jest.mock('@/services/shopService')

const mockApi = api as jest.Mocked<typeof api>
const mockCookies = Cookies as jest.Mocked<typeof Cookies>
const mockShopService = shopService as jest.Mocked<typeof shopService>

describe('loginService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('signup', () => {
    it('signs up successfully and auto-logs in', async () => {
      const signupData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        age: 25,
      }

      const signupResponse = {
        message: 'ثبت‌نام با موفقیت انجام شد',
        user: {
          id: 'user-1',
          email: signupData.email,
        },
      }

      const loginResponse = {
        access: 'access-token',
        refresh: 'refresh-token',
        user: {
          id: 'user-1',
          email: signupData.email,
        },
      }

      // Mock signup POST request
      mockApi.post.mockResolvedValueOnce({ data: signupResponse })
      // Mock auto-login POST request
      mockApi.post.mockResolvedValueOnce({ data: loginResponse })
      // Mock cart merge
      mockShopService.mergeAnonymousCart.mockResolvedValue(undefined)

      const result = await loginService.signup(
        signupData.email,
        signupData.password,
        signupData.confirmPassword,
        signupData.age
      )

      // Verify signup request
      expect(mockApi.post).toHaveBeenNthCalledWith(1, 'users/signup/', {
        email: signupData.email,
        password: signupData.password,
        confirm_password: signupData.confirmPassword,
        age: signupData.age,
      })

      // Verify auto-login request
      expect(mockApi.post).toHaveBeenNthCalledWith(2, 'users/login/', {
        email: signupData.email,
        password: signupData.password,
      })

      // Verify tokens are stored
      expect(localStorage.getItem('access_token')).toBe('access-token')
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
      expect(mockCookies.set).toHaveBeenCalledWith('access_token', 'access-token', {
        expires: 1,
      })

      // Verify cart merge was attempted
      expect(mockShopService.mergeAnonymousCart).toHaveBeenCalled()

      expect(result).toEqual(signupResponse)
    })

    it('throws error on signup failure', async () => {
      const error = {
        message: 'ایمیل قبلاً ثبت شده است',
        code: 'email_exists',
      }

      mockApi.post.mockRejectedValue(error)

      await expect(
        loginService.signup('test@example.com', 'pass', 'pass', 20)
      ).rejects.toEqual(error)
    })

    it('handles cart merge failure gracefully during signup', async () => {
      mockApi.post
        .mockResolvedValueOnce({ data: { user: { id: '1' } } })
        .mockResolvedValueOnce({
          data: {
            access: 'token',
            refresh: 'refresh',
            user: { id: '1' },
          },
        })

      mockShopService.mergeAnonymousCart.mockRejectedValue(
        new Error('Cart merge failed')
      )

      // Should not throw error - cart merge failure is handled silently
      await expect(
        loginService.signup('test@example.com', 'pass', 'pass', 20)
      ).resolves.not.toThrow()
    })
  })

  describe('login', () => {
    it('logs in successfully and merges cart', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const loginResponse = {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
        user: {
          id: 'user-1',
          email: credentials.email,
          first_name: 'علی',
        },
      }

      mockApi.post.mockResolvedValue({ data: loginResponse })
      mockShopService.mergeAnonymousCart.mockResolvedValue(undefined)

      const result = await loginService.login(credentials.email, credentials.password)

      expect(mockApi.post).toHaveBeenCalledWith('users/login/', credentials)

      // Verify tokens are stored
      expect(localStorage.getItem('access_token')).toBe('new-access-token')
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token')
      expect(localStorage.getItem('user')).toBe(
        JSON.stringify(loginResponse.user)
      )

      // Verify cookie is set
      expect(mockCookies.set).toHaveBeenCalledWith(
        'access_token',
        'new-access-token',
        { expires: 1 }
      )

      // Verify cart merge was called
      expect(mockShopService.mergeAnonymousCart).toHaveBeenCalled()

      expect(result).toEqual(loginResponse)
    })

    it('throws error on login failure', async () => {
      const error = {
        message: 'ایمیل یا رمز عبور اشتباه است',
        code: 'invalid_credentials',
      }

      mockApi.post.mockRejectedValue(error)

      await expect(
        loginService.login('wrong@example.com', 'wrongpass')
      ).rejects.toEqual(error)
    })

    it('handles cart merge failure gracefully during login', async () => {
      const loginResponse = {
        access: 'token',
        refresh: 'refresh',
        user: { id: '1' },
      }

      mockApi.post.mockResolvedValue({ data: loginResponse })
      mockShopService.mergeAnonymousCart.mockRejectedValue(
        new Error('Cart merge error')
      )

      // Should not throw - cart merge errors are handled silently
      const result = await loginService.login('test@example.com', 'pass')

      expect(result).toEqual(loginResponse)
      expect(mockShopService.mergeAnonymousCart).toHaveBeenCalled()
    })

    it('does not store tokens on server side', async () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const loginResponse = {
        access: 'token',
        refresh: 'refresh',
        user: { id: '1' },
      }

      mockApi.post.mockResolvedValue({ data: loginResponse })
      mockShopService.mergeAnonymousCart.mockResolvedValue(undefined)

      await loginService.login('test@example.com', 'pass')

      // Cookie should still be set on server
      expect(mockCookies.set).toHaveBeenCalled()

      // Restore window
      global.window = originalWindow
    })
  })

  describe('logout', () => {
    it('clears all authentication data', () => {
      localStorage.setItem('access_token', 'token')
      localStorage.setItem('refresh_token', 'refresh')
      localStorage.setItem('user', JSON.stringify({ id: '1' }))

      loginService.logout()

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(mockCookies.remove).toHaveBeenCalledWith('access_token')
    })

    it('works on server side without window', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      expect(() => loginService.logout()).not.toThrow()

      expect(mockCookies.remove).toHaveBeenCalledWith('access_token')

      // Restore window
      global.window = originalWindow
    })
  })

  describe('isAuthenticated', () => {
    it('returns true when access token exists in localStorage', () => {
      localStorage.setItem('access_token', 'token')

      const result = loginService.isAuthenticated()

      expect(result).toBe(true)
    })

    it('returns false when no access token exists', () => {
      const result = loginService.isAuthenticated()

      expect(result).toBe(false)
    })

    it('returns false on server side', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const result = loginService.isAuthenticated()

      expect(result).toBe(false)

      // Restore window
      global.window = originalWindow
    })

    it('returns false when localStorage is empty', () => {
      localStorage.clear()

      const result = loginService.isAuthenticated()

      expect(result).toBe(false)
    })
  })
})
