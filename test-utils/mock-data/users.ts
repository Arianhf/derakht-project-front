import { User, UserAddress } from '@/contexts/UserContext'

let userIdCounter = 1

export function createMockUser(overrides?: Partial<User>): User {
  const id = String(userIdCounter++)
  return {
    id,
    email: `user${id}@example.com`,
    first_name: 'علی',
    last_name: 'احمدی',
    phone_number: '09121234567',
    profile_image: null,
    ...overrides,
  }
}

export function createMockUserAddress(overrides?: Partial<UserAddress>): UserAddress {
  return {
    id: '1',
    recipient_name: 'علی احمدی',
    address: 'تهران، خیابان ولیعصر، پلاک 100',
    city: 'تهران',
    province: 'تهران',
    postal_code: '1234567890',
    phone_number: '09121234567',
    is_default: true,
    ...overrides,
  }
}

export const mockUser: User = createMockUser({
  id: '1',
  email: 'test@example.com',
  first_name: 'علی',
  last_name: 'احمدی',
  phone_number: '09121234567',
  default_address: createMockUserAddress(),
})

export const mockUserAddresses: UserAddress[] = [
  createMockUserAddress({
    id: '1',
    recipient_name: 'علی احمدی',
    city: 'تهران',
    is_default: true,
  }),
  createMockUserAddress({
    id: '2',
    recipient_name: 'مریم رضایی',
    city: 'اصفهان',
    province: 'اصفهان',
    postal_code: '9876543210',
    phone_number: '09131234567',
    is_default: false,
  }),
]

export const mockAuthTokens = {
  access: 'mock-access-token-123',
  refresh: 'mock-refresh-token-456',
}

export const mockLoginResponse = {
  ...mockAuthTokens,
  user: mockUser,
}
