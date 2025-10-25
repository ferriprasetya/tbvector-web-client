// File: eslint.config.js
// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/', 'node_modules/'],
  },

  // Base configuration for all files
  eslint.configs.recommended,

  // TypeScript configurations that require type information.
  // This replaces the simpler '...tseslint.configs.recommended'.
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier configuration to disable conflicting rules
  // This must be the last configuration.
  prettierConfig,

  // Project-specific configurations
  {
    // Provide language options to the parser, including project configuration for typed linting.
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    // Custom rules for your project
    rules: {
      // Allow unused variables if they are prefixed with an underscore (e.g., _req).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // Encourage explicit return types on functions for better code clarity.
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      // Disable rules that are too strict or not suitable for your project.
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
)
