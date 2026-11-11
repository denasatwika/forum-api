import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';

export default defineConfig([
  {
    plugins: {
      vitest,
    },
  },
  daStyle,
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: { ...vitest.environments.env.globals, ...globals.node } } },
  {
    ignores: ['coverage/**'],
  },
  {
    // Parameter method abstrak for kontrak interface
    files: ['src/Domains/**/*Repository.js', 'src/Applications/security/*.js'],
    rules: {
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
  {
    // Nama kolom database mengikuti konvensi snake_case PostgreSQL.
    rules: {
      camelcase: ['error', {
        allow: ['^thread_id$', '^comment_id$', '^is_delete$'],
      }],
    },
  },
]);