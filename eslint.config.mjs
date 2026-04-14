import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.pnpm/**',
      '**/.turbo/**',
      '**/generated/**',
      '**/prisma.config.ts'
    ]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['apps/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      'no-console': 'off'
    }
  }
]
