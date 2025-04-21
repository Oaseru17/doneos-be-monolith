/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
require('reflect-metadata');

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  setupFilesAfterEnv: ['<rootDir>/jest.config.js'],
  coverageThreshold: {
  }
};