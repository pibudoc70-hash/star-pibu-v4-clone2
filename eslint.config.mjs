// eslint.config.mjs — ESLint 9 flat config
// React 19 + TypeScript 스택 (eslint-plugin-react-hooks, eslint-plugin-jsx-a11y 포함)
// 기존 코드 호환: jsx-a11y 규칙은 warn으로 설정하여 빌드를 깨지 않음
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  // ── 전역 무시 패턴 ──────────────────────────────────────────────
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'drizzle/migrations/**',
      'scripts/**',        // playwright 스크래핑 스크립트 (ESM, 타입 없음)
      'patches/**',
      'client/public/**',
      'vite.config.ts',
      'vitest.config.ts',
      'drizzle.config.ts',
      'eslint.config.mjs',
    ],
  },

  // ── 기본 JS 권장 규칙 ────────────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript 권장 규칙 ─────────────────────────────────────────
  ...tseslint.configs.recommended,

  // ── React + Hooks + a11y (클라이언트 코드) ───────────────────────
  {
    files: ['client/src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',   // React 17+ JSX transform
      'react/prop-types': 'off',            // TypeScript가 대신 검사
      'react/display-name': 'warn',

      // React Hooks
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',  // 훅 규칙 위반은 실제 버그이므로 error 유지

      // jsx-a11y — 기존 코드 호환을 위해 모두 warn (신규 코드에서는 반드시 수정)
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'error',

      // 기타
      'no-useless-escape': 'warn',
    },
  },

  // ── 서버 코드 (React 규칙 제외) ──────────────────────────────────
  {
    files: ['server/**/*.ts', 'shared/**/*.ts', 'drizzle/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-require-imports': 'error',
    },
  },
);
