import type { FolderHarbor } from "../index.js";
import type { FHSession } from "../../sdk.js";

export class MeResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  public info = async (): Promise<FHSelfInfo> => { return await this.#client.request<FHSelfInfo>("me"); }
  public edit = async (body: FHSelfInfoEdit) => { await this.#client.request("me", { method: "PATCH", body: JSON.stringify(body) }); }
  public revokeSession =  async (body: FHSelfRevokeSession) => { await this.#client.request(`me/session`, { method: "DELETE", body: JSON.stringify(body) }); }
}

export type FHSelfInfo = { id: number, username: string, sessions: FHSession[], activeSession: number, failedLoginLockout: boolean, permissions: string[] }
export type FHSelfInfoEdit = { username?: string, password?: string, clearLoginAttempts?: boolean }
export type FHSelfRevokeSession = { sessionID: number }