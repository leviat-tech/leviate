module.exports = {
  moduleFileExtensions: [
    'js',
    'mjs',
    'json',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: [".cwd"],
  // resolver: '<rootDir>/test/utils/jest-resolver.js',
  setupFilesAfterEnv: ['<rootDir>/__tests__/utils/jest-setup'],
  // testEnvironment: 'jsdom',
  transform: {
    // '.*\\.(vue)$': 'vue-jest',
    '.*\\.(m?js)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@crhio).+\\.js$',
  ],
};
