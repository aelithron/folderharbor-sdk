// this is an example of many methods in the SDK! :3
import { FolderHarbor } from "./src/index.js";
async function example() {
  const client = new FolderHarbor({ server: "https://demo.fh.novatea.dev" });
  const clientConfig = await client.clientconfig();
  if (!clientConfig.registration) throw new Error("Registration isn't enabled on the server, can't continue!");
  let username: string = "ts-sdk-tester";
  await client.auth.register({ username, password: "mrrp" });
  let info = await client.me.info();
  console.log(`Registered user ${info.username} (ID #${info.id}) (Session ID #${info.activeSession}) (POST /auth/register)`);
  if (clientConfig.selfUsernameChanges) {
    try {
      await client.me.edit({ username, password: "mrow" });
      username = "ts-sdk-test";
      console.log("Changed own username and password! (PATCH /me)");
    } catch {
      await client.me.edit({ password: "mrow" });
      console.warn("Error changing own username, the new one likely was taken!");
      console.log("Changed own password! (PATCH /me)");
    }
  } else {
    await client.me.edit({ password: "mrow" });
    console.warn("Self username changes aren't enabled on the server.");
    console.log("Changed own password! (PATCH /me)");
  }
  await client.auth.login({ username, password: "mrow" });
  const tempSessionInfo = await client.me.info();
  console.log(`Logged back in - session #${tempSessionInfo.activeSession} (password changes sign you out) (POST /auth)`);
  await client.auth.login({ username, password: "mrow" });
  info = await client.me.info();
  console.log(`Logged in again for a new session - session #${info.activeSession} (POST /auth)`);
  await client.me.revokeSession({ sessionID: tempSessionInfo.activeSession });
  console.log(`Signed out session #${tempSessionInfo.activeSession} (currently on session #${info.activeSession}) (DELETE /me/session)`);
  const protocols = await client.protocols();
  console.log(`Got protocol URLs - WebDAV: ${protocols.webdav || "Disabled"} | FTP: ${protocols.ftp || "Disabled"} (GET /protocols)`);
  const permList = await client.admin.permissions();
  console.log(`Got permission list! Random one: ${permList[Math.floor(Math.random() * permList.length)].id} (GET /admin/permissions)`);
  const logs = await client.admin.logs();
  console.log(`Got latest logs! Latest one: ${logs.logs[0].username} (ID #${logs.logs[0].userID}) ${logs.logs[0].blurb} (${logs.logs[0].action}) at ${new Date(logs.logs[0].createdAt).toISOString()}! (GET /admin/logs)`);

  if (info.permissions.includes("users:delete")) {
    await client.admin.users.delete(info.id);
    console.log(`Deleted own account (DELETE /admin/users/${info.id}), thanks for checking out the SDK! :3`);
  } else console.warn(`No permission to delete own account, you may want to delete it yourself (credentials are ${username} / mrow).\nThanks for checking out the SDK! :3`);
}
example();