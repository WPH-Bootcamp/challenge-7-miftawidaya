import eslintConfigPrettier from 'eslint-config-prettier/flat';
import pluginNext from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['components/ui/**', '.next/**', 'node_modules/**'],
  },
  eslintConfigPrettier,
];

export default eslintConfig;
