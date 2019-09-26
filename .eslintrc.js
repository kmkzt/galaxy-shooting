module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ['plugin:react/recommended', 'prettier/@typescript-eslint'],
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    strict: 'error',
    'check-constructor': false,
    'no-comma-dangle': false,
    'no-empty-interface': false,
    'no-unused-vars': [1, { vars: 'all', args: 'after-used' }],
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2
      }
    ]
  }
}
