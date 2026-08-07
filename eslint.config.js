import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Flat ESLint config.
 *
 * Type-aware rules are deliberately off: `astro check` (npm run typecheck)
 * already type-checks `.astro`, `.ts` and `.mdx` with the compiler, and running
 * typescript-eslint's project service over `.astro` files is slow and brittle.
 * ESLint's job here is correctness patterns and accessibility.
 */
export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'docs/design-handoff/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro templates, plus accessibility rules over their markup.
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-recommended'],

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Unused args are fine when prefixed with an underscore.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Prefer `import type` so type-only imports are erased predictably.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },

  // Inline <script> blocks in .astro files run in the browser.
  {
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Config files run in Node and may reach for its globals.
  {
    files: ['*.config.{js,ts,mjs}', 'scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
