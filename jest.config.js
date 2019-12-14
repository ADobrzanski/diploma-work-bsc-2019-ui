module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '\\.musicxml$': 'jest-raw-loader',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
