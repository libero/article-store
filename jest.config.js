module.exports = {
  setupFilesAfterEnv: [
    'jest-extended',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};
