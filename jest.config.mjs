export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const moduleFileExtensions = ['ts', 'json', 'js'];
export const rootDir = 'src';
export const testRegex = '.*\\.spec\\.ts$';
export const coverageDirectory = '../coverage';
export const setupFilesAfterEnv = ['<rootDir>/../jest.setup.ts'];
export const testTimeout = 120000;
