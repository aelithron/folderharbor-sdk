import { expect, test } from "@jest/globals";
import { FolderHarbor } from "../src/index.js"
test("checks client init", () => {
  const client = new FolderHarbor({ server: "http://mock-server.local" });
  expect(client).not.toThrow();
});