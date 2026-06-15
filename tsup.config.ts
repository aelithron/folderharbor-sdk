import { defineConfig } from "tsup";
export default defineConfig((options) => {
  return {
    entry: ["src/index.ts"],
    dts: true,
    format: ["esm"],
    clean: true,
    ...options
  }
});