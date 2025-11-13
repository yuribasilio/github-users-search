/** @type {import('eslint').Linter.Config} */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'unused-imports',
    'simple-import-sort',
    'prettier',
  ],
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],

  rules: {
    // 🔥 Prettier como fonte de verdade
    'prettier/prettier': 'error',

    // 🚫 Remover imports não usados automaticamente
    'unused-imports/no-unused-imports': 'error',

    // 📦 Ordenação automática de imports
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // 🔤 Ordenação alfabética de imports (extra)
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [['builtin', 'external'], ['internal'], ['parent'], ['sibling', 'index']],
        'newlines-between': 'always',
      },
    ],

    // 🧹 Sem variáveis não usadas
    '@typescript-eslint/no-unused-vars': ['error'],

    // ❗ Proibir imports absolutos sem alias "@"
    'import/no-relative-parent-imports': 'off',

    // Outras regras úteis
    semi: ['error', 'always'], // usar ;
    quotes: ['error', 'single'], // usar aspas simples
  },
};
