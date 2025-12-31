import { renderHook, waitFor } from '@testing-library/react'
import { useFeatureFlags, FeatureFlagProvider } from '@/contexts/FeatureFlagContext'
import { featureFlagService } from '@/services/featureFlagService'

// Mock dependencies
jest.mock('@/services/featureFlagService', () => ({
  featureFlagService: {
    getAllFlags: jest.fn(),
  },
}))

const mockFeatureFlagService = featureFlagService as jest.Mocked<typeof featureFlagService>

describe('FeatureFlagContext', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    process.env.NODE_ENV = 'production'
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('useFeatureFlags hook', () => {
    it('throws error when used outside FeatureFlagProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useFeatureFlags())
      }).toThrow('useFeatureFlags must be used within a FeatureFlagProvider')

      consoleError.mockRestore()
    })

    it('can be used within FeatureFlagProvider', () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'feature1', enabled: true },
        { name: 'feature2', enabled: false },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      expect(result.current).toBeDefined()
      expect(result.current.isFeatureEnabled).toBeInstanceOf(Function)
      expect(result.current.flags).toBeDefined()
    })
  })

  describe('initial state', () => {
    it('starts with loading true', () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      expect(result.current.loading).toBe(true)
    })

    it('sets loading to false after fetching flags', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'feature1', enabled: true },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('fetches feature flags on mount', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'enableNewUI', enabled: true },
        { name: 'enableBetaFeatures', enabled: false },
        { name: 'enableExperimentalCheckout', enabled: true },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.flags).toEqual({
          enableNewUI: true,
          enableBetaFeatures: false,
          enableExperimentalCheckout: true,
        })
      })

      expect(mockFeatureFlagService.getAllFlags).toHaveBeenCalledTimes(1)
    })

    it('handles empty flags response', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.flags).toEqual({})
    })

    it('handles fetch error silently', async () => {
      mockFeatureFlagService.getAllFlags.mockRejectedValue(
        new Error('Network error')
      )

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Error handled silently, flags remain as empty object
      expect(result.current.flags).toEqual({})
    })
  })

  describe('isFeatureEnabled', () => {
    it('returns true for enabled features', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'newDashboard', enabled: true },
        { name: 'betaMode', enabled: false },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isFeatureEnabled('newDashboard')).toBe(true)
    })

    it('returns false for disabled features', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'newDashboard', enabled: true },
        { name: 'betaMode', enabled: false },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isFeatureEnabled('betaMode')).toBe(false)
    })

    it('returns false for unknown features', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'newDashboard', enabled: true },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isFeatureEnabled('unknownFeature')).toBe(false)
    })

    it('handles multiple feature checks', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'feature1', enabled: true },
        { name: 'feature2', enabled: false },
        { name: 'feature3', enabled: true },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isFeatureEnabled('feature1')).toBe(true)
      expect(result.current.isFeatureEnabled('feature2')).toBe(false)
      expect(result.current.isFeatureEnabled('feature3')).toBe(true)
      expect(result.current.isFeatureEnabled('feature4')).toBe(false)
    })
  })

  describe('localStorage overrides in development', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    it('overrides flag with localStorage value when available', async () => {
      localStorage.setItem('feature_betaMode', 'true')

      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'betaMode', enabled: false }, // Server says false
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // localStorage override should make it true in development
      expect(result.current.isFeatureEnabled('betaMode')).toBe(true)
    })

    it('overrides to false when localStorage has "false"', async () => {
      localStorage.setItem('feature_newUI', 'false')

      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'newUI', enabled: true }, // Server says true
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // localStorage override should make it false in development
      expect(result.current.isFeatureEnabled('newUI')).toBe(false)
    })

    it('uses server value when no localStorage override', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'normalFeature', enabled: true },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // No override, should use server value
      expect(result.current.isFeatureEnabled('normalFeature')).toBe(true)
    })

    it('adds feature from localStorage that server does not have', async () => {
      localStorage.setItem('feature_secretFeature', 'true')

      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'normalFeature', enabled: true },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Should enable feature from localStorage even if not in server response
      expect(result.current.isFeatureEnabled('secretFeature')).toBe(true)
    })
  })

  describe('localStorage overrides in production', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('ignores localStorage overrides in production', async () => {
      localStorage.setItem('feature_betaMode', 'true')

      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'betaMode', enabled: false },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // In production, should ignore localStorage and use server value
      expect(result.current.isFeatureEnabled('betaMode')).toBe(false)
    })
  })

  describe('flags object', () => {
    it('exposes all fetched flags', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'feature1', enabled: true },
        { name: 'feature2', enabled: false },
        { name: 'feature3', enabled: true },
        { name: 'feature4', enabled: false },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.flags).toEqual({
          feature1: true,
          feature2: false,
          feature3: true,
          feature4: false,
        })
      })
    })

    it('starts with empty flags object', () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      expect(result.current.flags).toEqual({})
    })
  })

  describe('edge cases', () => {
    it('handles feature names with special characters', async () => {
      mockFeatureFlagService.getAllFlags.mockResolvedValue([
        { name: 'feature-with-dash', enabled: true },
        { name: 'feature_with_underscore', enabled: false },
        { name: 'feature.with.dot', enabled: true },
      ])

      const { result } = renderHook(() => useFeatureFlags(), {
        wrapper: FeatureFlagProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isFeatureEnabled('feature-with-dash')).toBe(true)
      expect(result.current.isFeatureEnabled('feature_with_underscore')).toBe(false)
      expect(result.current.isFeatureEnabled('feature.with.dot')).toBe(true)
    })
  })
})
