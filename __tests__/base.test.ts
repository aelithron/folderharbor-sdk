import { expect, test } from "@jest/globals";
import { FolderHarbor } from "../src/index.js"
test("checks client init", () => {
  expect(() => new FolderHarbor({ server: "http://mock-server.local" })).not.toThrow();
});