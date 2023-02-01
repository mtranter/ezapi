module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', "turbo", "prettier"],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "react/jsx-key": "off",
    "@typescript-eslint/ban-types": "off"
  },
  root: true,
};
