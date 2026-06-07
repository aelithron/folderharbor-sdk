import type { FolderHarbor } from "..";

export class MeResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client }
  async info(): Promise<FHSelfInfo> {
    return await this.#client.request<FHSelfInfo>("me");
  }
  async edit(body: { username?: string, password?: string, clearLoginAttempts?: boolean }) {
    await this.#client.request("me", { method: "PATCH", body: JSON.stringify(body) });
  }
}

export type FHSelfInfo = { id: number, username: string, sessions: FHSession[], activeSession: number, failedLoginLockout: boolean, permissions: string }
type FHSession = { id: number, createdAt: Date, expiry: Date }