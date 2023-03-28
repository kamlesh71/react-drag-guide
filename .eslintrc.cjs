module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/key-spacing': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-console': 1, // Means warning
    'prettier/prettier': 2, // M
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
};
