import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";
const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = { 
  preset: "ts-jest",
  clearMocks: true,
  transform: { ...tsJestTransformCfg },
  testEnvironment: "node"
}
export default config;