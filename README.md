# Derakht

A Persian-language educational platform for children featuring interactive story creation, educational blog content, and an e-commerce shop for educational packages.

## Features

- **Story Creation**: Interactive story builder with canvas-based editing
- **Educational Blog**: Rich content management with categories and tags
- **E-Commerce Shop**: Educational packages, cart management, and checkout
- **User Authentication**: Token-based authentication with automatic refresh
- **RTL Support**: Full Persian (Farsi) language support with right-to-left layout
- **Feature Flags**: Gradual feature rollout with toggleable features
- **Anonymous Shopping**: Cart support for both authenticated and guest users

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **State Management**: React Context API
- **API Client**: Axios with interceptors
- **Testing**: Jest, React Testing Library, Playwright
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=your_api_base_url
```

## Development Commands

### Core Development

```bash
pnpm dev              # Start development server
pnpm build            # Build production application
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Testing

```bash
# Unit & Integration Tests
pnpm test             # Run tests in watch mode
pnpm test:ci          # CI mode with coverage
pnpm test:coverage    # Generate coverage report

# E2E Tests
pnpm test:e2e         # Run E2E tests headless
pnpm test:e2e:ui      # Run with Playwright UI
pnpm test:e2e:debug   # Debug mode
pnpm test:all         # Run all tests
```

### Running Individual Tests

```bash
# Single test file
pnpm test -- path/to/test.test.ts

# Specific test suite
pnpm test -- -t "test name pattern"

# Watch single file
pnpm test -- path/to/test.test.ts --watch
```

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── shared/            # Shared components
│   │   ├── shop/              # E-commerce components
│   │   ├── story/             # Story creation components
│   │   └── blog/              # Blog components
│   ├── contexts/              # React Context providers
│   ├── services/              # API service layer
│   ├── types/                 # TypeScript type definitions
│   ├── constants/             # Constants and error messages
│   ├── utils/                 # Utility functions
│   └── middleware.ts          # Next.js middleware (route protection)
├── __tests__/                 # Test files
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── components/            # Component tests
└── public/                    # Static assets
```

## Architecture Highlights

### State Management

- **UserProvider**: Global authentication state
- **FeatureFlagProvider**: Feature toggle management
- **CartProvider**: Conditional loading on shop routes only

### API Layer

- Axios-based client with automatic token refresh
- Request queue during token refresh
- Standardized error handling with Persian messages
- Anonymous cart support via headers

### Authentication

- Token-based authentication (access + refresh tokens)
- Automatic token refresh on 401 errors
- Route protection via Next.js middleware
- Tokens stored in both localStorage and cookies

### Testing Strategy

- MSW for API mocking
- Component tests with React Testing Library
- E2E tests with Playwright
- Target: 90% code coverage

## Deployment

### Docker

Multi-stage build with standalone Next.js output:

```bash
docker build --build-arg NEXT_PUBLIC_BASE_URL=https://api.example.com .
docker run -p 3000:3000 derakht
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.
