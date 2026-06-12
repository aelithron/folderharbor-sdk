import { expect, test } from "@jest/globals";
import { FolderHarbor } from "../src/index.js"
import { FHRequestError } from "../src/errors.js";
test("checks valid login", async () => {
  const client = new FolderHarbor({ server: "http://mock-server.local" });
  const token = await client.auth.login({ username: "meow", password: "mrrp" });
  expect(token).toEqual("nya");
});
test("checks incorrect username", async () => {
  const client = new FolderHarbor({ server: "http://mock-server.local" });
  await expect(client.auth.login({ username: "mrow", password: "mrrp" })).toThrow(FHRequestError);
});
test("checks incorrect password", async () => {
  const client = new FolderHarbor({ server: "http://mock-server.local" });
  await expect(client.auth.login({ username: "meow", password: "mrow" })).rejects().toThrow(FHRequestError);
});