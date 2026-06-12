import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";
const tsJestTransformCfg = createDefaultEsmPreset().transform;

const config: Config = { 
  preset: "ts-jest/presets/default-esm",
  clearMocks: true,
  transform: { ...tsJestTransformCfg },
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.ts"]
}
export default config;