import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW server for Node.js test environment
 *
 * Usage in test files:
 * ```
 * import { server } from '@/__tests__/mocks/server'
 *
 * beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 * ```
 *
 * Override handlers for specific tests:
 * ```
 * server.use(
 *   http.get('/api/endpoint', () => {
 *     return HttpResponse.json({ custom: 'response' })
 *   })
 * )
 * ```
 */
export const server = setupServer(...handlers)
