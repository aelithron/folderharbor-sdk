// this is an example of every method in the SDK! :3
import { FolderHarbor } from "./src/index.js";
async function example() {
  const client = new FolderHarbor({ server: "https://demo.fh.novatea.dev" });
  const clientConfig = await client.clientconfig()
  if (!clientConfig.registration) throw new Error("Registration isn't enabled on the server, can't continue!");
  await client.auth.register({ username: "ts-sdk-tester", password: "mrrp" });
  const info = await client.me.info();
  console.log(`Registered user ${info.username} (ID #${info.id})`);
  if (clientConfig.selfUsernameChanges) {
    await client.me.edit({ username: "ts-sdk-test", password: "mrow" });
    console.log("Changed own username and password! (PATCH /me)");
  } else {
    await client.me.edit({ password: "mrow" });
    console.warn("Self username changes aren't enabled on the server.");
    console.log("Changed own password! (PATCH /me)");
  }
  await client.auth.login({ username: (clientConfig.selfUsernameChanges ? "ts-sdk-test" : "ts-sdk-tester"), password: "mrow" });
  console.log("Logged back in (password changes sign you out)");
  if (info.permissions.includes("users:delete")) {
    await client.admin.users.delete(info.id);
    console.log("Deleted own account, thanks for checking out the SDK! :3");
  } else console.warn(`No permission to delete own account, you may want to delete it yourself (credentials are ${(clientConfig.selfUsernameChanges ? "ts-sdk-test" : "ts-sdk-tester")} / mrow).\nThanks for checking out the SDK! :3`);
}
example();