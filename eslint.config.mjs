import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '.next',
      'public/**',
      // Temporarily ignore files with existing violations
      // TODO: Remove these ignores as violations are fixed
      'src/components/illustration/DrawingCanvas.tsx',
      'src/components/illustration/AssetsPanel.tsx',
      'src/components/story/IllustrationCanvasEditor.tsx',
      'src/components/story/TextCanvasViewer.tsx',
      'src/components/story/TextCanvasEditor.tsx',
      'src/components/shop/CheckoutPage.tsx',
      'src/components/shop/OrderConfirmationPage.tsx',
      'src/components/login/LoginPage.tsx',
      'src/components/admin/TemplateForm.tsx',
      'src/components/admin/TemplatePartEditor.tsx',
      'src/components/checkout/ShippingForm.tsx',
      'src/constants/errorMessages.ts',
      'src/types/error.ts',
      'src/utils/errorLogger.ts',
      'src/utils/validation.ts',
      'src/services/storyService.tsx',
      'src/services/api.tsx',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'react': reactPlugin,
      'react-hooks': hooksPlugin,
      'import': importPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      // Next.js/React 17+ doesn't require React to be in scope for JSX
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Using TypeScript for type checking

      // Type safety rules
      '@typescript-eslint/no-explicit-any': 'error',

      // Import order rules (per CLAUDE.md guidelines)
      'import/order': ['error', {
        'groups': [
          'builtin',  // Node.js built-ins
          'external', // Third-party packages (React, Next.js)
          'internal', // Internal aliases (@/...)
          'parent',   // Parent relative imports (../)
          'sibling',  // Sibling relative imports (./)
          'index',    // Index imports
          'type',     // Type imports
        ],
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'external',
            'position': 'before',
          },
          {
            'pattern': 'next/**',
            'group': 'external',
            'position': 'before',
          },
          {
            'pattern': '@/components/**',
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '@/contexts/**',
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '@/services/**',
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '@/types/**',
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '@/utils/**',
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '@/constants/**',
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '@/assets/**',
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': './*.module.scss',
            'group': 'sibling',
            'position': 'after',
          },
        ],
        'pathGroupsExcludedImportTypes': ['react', 'next'],
        'newlines-between': 'never',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true,
        },
      }],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['jest.config.js', 'jest.polyfills.js', 'next.config.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
