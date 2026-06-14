import type { FolderHarbor, FHSession } from "../index.js";

/**
 * Methods for reading and changing the authenticated user's info.
 */
export class MeResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  /**
   * Gets the current user's information.
   * 
   * @returns Information about the logged in user
   */
  public info = async (): Promise<FHSelfInfo> => { return await this.#client.request<FHSelfInfo>("me"); }
  /**
   * Updates the current user's information.
   * 
   * @param body - The information you want to change / updates you want to make
   */
  public edit = async (body: FHSelfInfoEdit) => { await this.#client.request("me", { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Revokes a session token for the current user.
   * 
   * @param sessionID - The session ID for the session you want to revoke
   */
  public revokeSession =  async (sessionID: number) => { await this.#client.request(`me/session`, { method: "DELETE", body: JSON.stringify({ sessionID }) }); }
}

export type FHSelfInfo = { id: number, username: string, sessions: FHSession[], activeSession: number, failedLoginLockout: boolean, permissions: string[] }
export type FHSelfInfoEdit = { username?: string, password?: string, clearLoginAttempts?: boolean }