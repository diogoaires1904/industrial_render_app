/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'vuetify',
    '@vue/eslint-config-typescript',
    './.eslintrc-auto-import.json',
    'prettier'
  ],
  rules: {
    'no-console': 'off',
        'no-debugger': 'off',
        'no-unused-vars': 'warn',
        'vue/multi-word-component-names': 'off',
        'vue/reserved-component-names': 'off',
        'vue/no-v-html': 'off',
        'vue/no-unused-components': 'warn',
        'vue/valid-v-slot': 'off',
        'no-inner-declarations': 'off',
  },
}
