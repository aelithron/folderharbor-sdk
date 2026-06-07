import type { FolderHarbor } from "..";

export class MeResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  public info = async (): Promise<FHSelfInfo> => { return await this.#client.request<FHSelfInfo>("me"); }
  public edit = async (body: FHSelfInfoEdit) => { await this.#client.request("me", { method: "PATCH", body: JSON.stringify(body) }); }
}

export type FHSelfInfo = { id: number, username: string, sessions: FHSession[], activeSession: number, failedLoginLockout: boolean, permissions: string[] }
export type FHSelfInfoEdit = { username?: string, password?: string, clearLoginAttempts?: boolean }
type FHSession = { id: number, createdAt: Date, expiry: Date }