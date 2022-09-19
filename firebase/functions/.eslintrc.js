module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': [
    'google',
    'eslint:recommended',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
  },
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'spaced-comment': ['error', 'always'],
    'padded-blocks': ['error', 'always'],
    'max-len': ['error', {'code': 190}],
  },
};
