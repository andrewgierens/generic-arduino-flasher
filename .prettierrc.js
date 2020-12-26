// Some settings automatically inherited from .editorconfig

module.exports = {
  printWidth: 120,
  parser: 'typescript',
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  jsxBracketSameLine: false,
  trailingComma: 'all',
  arrowParens: 'avoid',
  bracketSpacing: true,
  overrides: [
    {
      files: ['.prettierrc', '*.json'],
      options: {
        parser: 'json',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      options: {
        parser: 'babel',
      },
    },
    {
      files: ['*.css'],
      options: {
        parser: 'postcss',
      },
    },
  ],
};
