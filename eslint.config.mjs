import { fileURLToPath } from 'node:url';
import path from 'node:path';
import nextConfigModule from 'eslint-config-next';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfigs = Array.isArray(nextConfigModule?.default ?? nextConfigModule)
  ? (nextConfigModule?.default ?? nextConfigModule)
  : [nextConfigModule?.default ?? nextConfigModule];

const nextConfigsWithProject = nextConfigs.map(config => {
  if (config?.name !== 'next/typescript') return config;

  return {
    ...config,
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...(config.languageOptions?.parserOptions ?? {}),
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
  };
});

export default [
  {
    ignores: ['**/*.js', '.next/**', '.dist/**', 'next-env.d.ts', 'next.config.js'],
  },
  ...nextConfigsWithProject,
  prettierRecommended,
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

