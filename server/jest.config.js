module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 30000, // memory server can be slow to start sometimes
  verbose: true,
};
