module.exports = {
  env: {
    node: true,
    browser: true,
    mocha: true,
    mongo: true
  },
  extends: ['last', 'prettier/react', 'plugin:react/recommended'],
  rules: {
    'no-console': 0
  },
  plugins: [ 'json', 'import' ]
};