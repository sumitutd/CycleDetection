module.exports = {
  roots: [
    '<rootDir>/',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '.test.tsx?$',
  // modulePathIgnorePatterns: ['mocks'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  restoreMocks: true,
  clearMocks: true,
  errorOnDeprecated: true,
  maxConcurrency: 50,
  notify: false,
  notifyMode: 'change',
  testTimeout: 1500,
  // bail: true,
};
