module.exports = {
  parser: 'babel-eslint',
  env: {
    jest: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  rules: {
    'comma-dangle': [
      2,
      'always-multiline',
    ],
  },
}
