import type { Config } from 'jest';

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  },
  setupFiles: ["<rootDir>/jest.setup.ts"]
};

export default config;
