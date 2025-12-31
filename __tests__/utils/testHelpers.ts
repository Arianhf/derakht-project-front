import { screen, within } from '@testing-library/react'
import type { StandardErrorResponse } from '@/types/error'

/**
 * Test helper utilities for common testing operations
 */

/**
 * Find element by Persian text content
 * Useful for finding buttons, headings, etc. with Persian text
 */
export const findByPersianText = (text: string, container?: HTMLElement) => {
  const searchContainer = container || screen
  return searchContainer.getByText((content, element) => {
    return element?.textContent === text
  })
}

/**
 * Check if element has Persian text
 */
export const hasPersianText = (element: HTMLElement, text: string): boolean => {
  return element.textContent === text
}

/**
 * Get all form fields within a container
 */
export const getFormFields = (container: HTMLElement) => {
  return {
    inputs: within(container).getAllByRole('textbox'),
    buttons: within(container).getAllByRole('button'),
    selects: within(container).queryAllByRole('combobox'),
  }
}

/**
 * Create a mock error response
 */
export const createMockError = (
  code: string = 'GENERIC_ERROR',
  message: string = 'خطای تست'
): StandardErrorResponse => ({
  code,
  message,
  severity: 'error',
})

/**
 * Wait for an element to be removed from the DOM
 */
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.body.contains(element)) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

/**
 * Mock window.matchMedia for responsive tests
 */
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

/**
 * Create a mock File object for upload tests
 */
export const createMockFile = (
  name: string = 'test.jpg',
  type: string = 'image/jpeg',
  size: number = 1024
): File => {
  const file = new File(['test content'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

/**
 * Mock router push/replace for navigation tests
 */
export const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
})

/**
 * Helper to assert toast messages
 */
export const expectToastError = (message: string) => {
  const toast = require('react-hot-toast')
  expect(toast.toast.error).toHaveBeenCalledWith(message)
}

export const expectToastSuccess = (message: string) => {
  const toast = require('react-hot-toast')
  expect(toast.toast.success).toHaveBeenCalledWith(message)
}

/**
 * Helper to check if an element has a specific class
 */
export const hasClass = (element: HTMLElement, className: string): boolean => {
  return element.classList.contains(className)
}

/**
 * Get Persian digits from English digits
 * Useful for asserting Persian number display
 */
export const toPersianDigits = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)])
}

/**
 * Format price in Persian format
 * Matches the formatPrice utility in the app
 */
export const formatPersianPrice = (price: number): string => {
  const formatted = price.toLocaleString('fa-IR')
  return `${formatted} تومان`
}
