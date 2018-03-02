module.exports = {
  env: {
    node: true,
    browser: true,
    mocha: true,
    mongo: true,
    jquery: true,
  },
  extends: ['airbnb', 'prettier/react', 'last'],
  rules: {
    'no-console': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 1,
    'global-require': 0,
  },
  plugins: ['json', 'import', 'prettier'],
};
