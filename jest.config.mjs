/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import {pathsToModuleNameMapper} from "ts-jest";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'tsconfig.base.json'), 'utf8'),
)

/** @type {import('ts-jest').JestConfigWithTsJest} */
/** @type {import('jest').Config} */
const config = {
  'moduleNameMapper': {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      prefix: `${__dirname}/`,
      useESM: true
    }),
  },
  // automock: true,
  clearMocks: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  'setupFilesAfterEnv': ['jest-extended/all'],
  'rootDir': __dirname,
  roots: ['<rootDir>'],
  'passWithNoTests': true,
  'moduleFileExtensions': ['js', 'json', 'ts'],
  'testPathIgnorePatterns': ['/node_modules/', '/cypress/'],
  'testRegex': '.*\\.spec\\.ts$',
};

export default config;
