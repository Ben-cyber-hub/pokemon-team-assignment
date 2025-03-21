module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!(superjson|@tanstack/react-query-devtools)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};