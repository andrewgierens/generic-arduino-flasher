module.exports = {
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript', 'prettier'],
  rules: {
    // I use named exports
    'import/prefer-default-export': 'off',
    // Igonre storybook dep for story files
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.stories.{js,jsx,ts,tsx}'],
      },
    ],
    // I use this. Just don't spud it up
    'react/jsx-props-no-spreading': 'off',
    // This is probably the most annoying thing that has ever happened
    'react/jsx-one-expression-per-line': 'off',
  },
};
