import { authHandlers } from './auth'
import { shopHandlers } from './shop'
import { userHandlers } from './user'

export const handlers = [
  ...authHandlers,
  ...shopHandlers,
  ...userHandlers,
]
