import { expect, test } from "@jest/globals";
import { FolderHarbor } from "../src/index.js"
import { FHRequestError } from "../src/errors.js";

const client = new FolderHarbor({ server: "http://mock-server.local" });
test("checks valid login", async () => {
  const { token } = await client.auth.login({ username: "meow", password: "mrrp", persist: false });
  expect(token).toEqual("nya");
});
test("checks incorrect username", async () => {
  try {
    await client.auth.login({ username: "mrow", password: "mrrp", persist: false });
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(FHRequestError);
    expect((e as FHRequestError).code).toEqual("username");
  }
});
test("checks incorrect password", async () => {
  try {
    await client.auth.login({ username: "meow", password: "mrow", persist: false });
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(FHRequestError);
    expect((e as FHRequestError).code).toEqual("password");
  }
});