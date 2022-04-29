const commonConfig = {
  moduleFileExtensions: [
    'js',
    'mjs',
    'json',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: [".cwd"],
  setupFilesAfterEnv: ['<rootDir>/__tests__/utils/jest-setup'],
  transformIgnorePatterns: [
    '/node_modules/(?!@crhio).+\\.js$',
  ],
}

module.exports = {
  projects: [
    {
      ...commonConfig,
      displayName: 'core',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/__tests__/core/**/*.spec.js'],
      transform: {
        '.*\\.(vue)$': 'vue-jest',
        '.*\\.(m?js)$': 'babel-jest',
      },
    },
    {
      ...commonConfig,
      displayName: 'cli',
      testMatch: ['<rootDir>/__tests__/cli/**/*.spec.js'],
      transform: {
        '.*\\.(m?js)$': 'babel-jest',
      },
    }
  ],

};
