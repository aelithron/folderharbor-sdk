import { expect, test } from "@jest/globals";
import { FolderHarbor } from "../src/index.js"
import { FHAuthError } from "../src/errors.js";

test("checks valid self info", async () => {
  const client = new FolderHarbor({ server: "http://mock-server.local", token: "nya" });
  const me = await client.me.info();
  expect(me.id).toEqual(1);
  expect(me.username).toEqual("meow");
  expect(me.sessions).toHaveLength(1);
  expect(me.sessions[0].id).toEqual(1);
  expect(Number.isNaN(new Date(me.sessions[0].createdAt).getTime())).toBe(false);
  expect(Number.isNaN(new Date(me.sessions[0].expiry).getTime())).toBe(false);
  expect(me.activeSession).toEqual(1);
  expect(me.failedLoginLockout).toBe(false);
  expect(me.permissions).toHaveLength(1);
  expect(me.permissions).toContain("users:list");
});
test("checks locked account", async () => {
  const client = new FolderHarbor({ server: "http://mock-server.local", token: "locked" });
  try {
    await client.me.info();
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(FHAuthError);
    expect((e as FHAuthError).code).toEqual("locked");
  }
});
test("checks expired token", async () => {
  const client = new FolderHarbor({ server: "http://mock-server.local", token: "expired" });
  try {
    await client.me.info();
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(FHAuthError);
    expect((e as FHAuthError).code).toEqual("expired");
  }
});
test("checks no token", async () => {
  const client = new FolderHarbor({ server: "http://mock-server.local" });
  try {
    await client.me.info();
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(FHAuthError);
    expect((e as FHAuthError).code).toEqual("invalid");
  }
});