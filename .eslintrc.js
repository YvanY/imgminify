const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  env: {
    browser: true,
    node: true
  },
  plugins: [
    'vue'
  ],
  rules: {
    'no-debugger': isDev ? 'off' : 'error',
    'no-console': isDev ? 'off' : 'error',
    'vue/max-attributes-per-line': 'off',
    'space-before-function-paren': ['error', { 'named': 'never' }],
    'operator-linebreak': ['error', 'before']
  }
}
