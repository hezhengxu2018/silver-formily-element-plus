// eslint.config.mjs
import antfu from '@antfu/eslint-config'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default antfu({
  rules: {
    'no-console': 'off',
    'regexp/no-unused-capturing-group': 'off',
    ...eslintPluginUnicorn.configs['flat/recommended'].rules,
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/no-array-reduce': 'off',
    'test/prefer-lowercase-title': 'off',
  },
  formatters: {
    markdown: 'prettier',
  },
})
