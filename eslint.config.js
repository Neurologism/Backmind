import typeScriptEsLintPlugin from '@typescript-eslint/eslint-plugin';
import ParserTypeScriptEsLint from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    languageOptions: {
      sourceType: 'module',
      parser: ParserTypeScriptEsLint,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint/eslint-plugin': typeScriptEsLintPlugin,
    },
    ignores: ['node_modules', 'dist'],
  },
];
