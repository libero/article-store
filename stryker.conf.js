module.exports = function (config) {
  config.set({
    coverageAnalysis: 'off',
    files: ['src/**/*.ts', 'test/**/*.ts'],
    mutate: ['src/**/*.ts'],
    mutator: 'typescript',
    packageManager: 'npm',
    reporters: ['clear-text', 'progress'],
    testRunner: 'jest',
    transpilers: [],
    tsconfigFile: 'tsconfig.json',
  });
};
