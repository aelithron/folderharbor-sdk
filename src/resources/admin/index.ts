import { FolderHarbor } from "../../index.js";
import { ACLsResource } from "./acls.js";
import { ConfigResource } from "./config.js";
import { RolesResource } from "./roles.js";
import { UsersResource } from "./users.js";

/**
 * Methods for administering a FolderHarbor server.
 */
export class AdminResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) {
    this.#client = client;
    
    this.users = new UsersResource(client);
    this.roles = new RolesResource(client);
    this.acls = new ACLsResource(client);
    this.config = new ConfigResource(client);
  }
  /**
   * Read the server's audit log.
   * 
   * @param page - Page number to look at, defaults to page 1 (the latest logs)
   * @returns The log entries on that page (capping out at 20), as well as the total number of pages
   * @permission logs:read
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * const latestLogs = await client.admin.logs();
   * const oldestLogs = await client.admin.logs(latestLogs.pageCount);
   * ```
   */
  public logs = async (page?: number): Promise<FHLogs> => { return await this.#client.request<FHLogs>(`admin/logs${page ? `?page=${page}` : ""}`) }
  /**
   * Gets a list of permissions that can be applied to users or roles.
   * 
   * @returns A list of key-value pairs with permission nodes and their descriptions
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * const permList = await client.admin.permissions();
   * ```
   */
  public permissions = async (): Promise<FHPermissions> => { return await this.#client.request<FHPermissions>("admin/permissions") }
  /**
   * Revokes a session token for any user.
   * 
   * @param sessionID - The session ID for the session you want to revoke
   * @permission users:edit
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * await client.admin.revokeSession(6);
   * ```
   */
  public revokeSession = async (sessionID: number) => { await this.#client.request(`/admin/sessions/${sessionID}`, { method: "DELETE" }) }

  public users: UsersResource;
  public roles: RolesResource;
  public acls: ACLsResource;
  public config: ConfigResource;
}

export type FHLogs = { pageCount: number, logs: { userID: number, username: string | null, action: string, body: object | null, blurb: string, createdAt: Date }[] }
export type FHPermissions = { id: string, description: string }[]