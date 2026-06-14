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
   */
  public logs = async (page?: number): Promise<FHLogs> => { return await this.#client.request<FHLogs>(`admin/logs${page ? `?page=${page}` : ""}`) }
  /**
   * Gets a list of permissions that can be applied to users or roles.
   * 
   * @returns A list of key-value pairs with permission nodes and their descriptions
   */
  public permissions = async (): Promise<FHPermissions> => { return await this.#client.request<FHPermissions>("admin/permissions") }
  /**
   * Revokes a session token for any user.
   * 
   * @param sessionID - The session ID for the session you want to revoke
   */
  public revokeSession = async (sessionID: number) => { await this.#client.request(`/admin/sessions/${sessionID}`, { method: "DELETE" }) }

  public users: UsersResource;
  public roles: RolesResource;
  public acls: ACLsResource;
  public config: ConfigResource;
}

export type FHLogs = { pageCount: number, logs: { userID: number, username: string | null, action: string, body: object | null, blurb: string, createdAt: Date }[] }
export type FHPermissions = { id: string, description: string }[]