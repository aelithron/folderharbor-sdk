import { FolderHarbor, type FHSession } from "../../index.js";

/**
 * Methods for reading, listing, and updating users and their grants.
 */
export class UsersResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  /**
   * Gets the list of users and their IDs.
   * 
   * @returns A list of users (with their usernames and IDs)
   * @permission users:list
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * const users = await client.admin.users.list();
   * ```
   */
  public list = async (): Promise<FHUserList> => { return await this.#client.request<FHUserList>("admin/users"); }
  /**
   * Gets a user from their ID.
   * 
   * @param userID - The user's ID
   * @returns The user's information, either full or limited depending on your permission level
   * @permission users:read || users:read.full
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * const user = await client.admin.users.get(1);
   * ```
   */
  public get = async (userID: number): Promise<FHFullUser | FHLimitedUser> => { return await this.#client.request<FHFullUser | FHLimitedUser>(`admin/users/${userID}`); }
  /**
   * Edits a user's information.
   * This method is limited to their username, password, and clearing their failed logins.
   * 
   * @param userID - The user's ID
   * @param body - The information to change / updates to make
   * @permission users:edit
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * await client.admin.users.edit({ username: "meow", password: "mrrp", clearLoginAttempts: true });
   * ```
   */
  public edit = async (userID: number, body: FHEditUser) => { await this.#client.request(`admin/users/${userID}`, { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Grants and revokes roles, ACLs, and permissions on a user.
   * 
   * This is intended for cases where you don't already know the current state of these values (such as in a CLI), as it **does not** overwrite.
   * If you do know them (such as in a web panel), see {@link editGrants} instead.
   * 
   * @param userID - The user's ID
   * @param body - An array of grantable objects using their IDs, types, and whether to grant or revoke the object
   * @permission users:grant
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * const grants: FHGrantToUser = [
   *   { id: 2, type: "role", revoke: false },
   *   { id: 1, type: "acl", revoke: true },
   *   { id: "config:read", type: "permission", revoke: true }
   * ];
   * await client.admin.users.grant(1, grants);
   * ```
   */
  public grant = async (userID: number, body: FHGrantToUser) => { await this.#client.request(`admin/users/${userID}/grant`, { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Grants and revokes roles, ACLs, and permissions on a user directly.
   * 
   * This is intended for if you know the current state of these values (such as in a web panel), as it **does overwrite** their current states.
   * If you don't know them (such as in a CLI), see {@link grant} instead.
   * 
   * @param userID - The user's ID
   * @param body - Arrays of the role, ACL, and permission IDs to apply to the user
   * @permission users:grant
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * await client.admin.users.editGrants(1, { roles: [1, 2], acls: [2], permissions: ["users:list", "logs:read"] });
   * ```
   */
  public editGrants = async (userID: number, body: FHUserEditGrants) => { await this.#client.request(`admin/users/${userID}/grant`, { method: "PUT", body: JSON.stringify(body) }); }
  /**
   * Locks or unlocks a user's account.
   * 
   * @param userID - The user's ID
   * @param lock - Whether to lock or unlock the account (true = locked, false = unlocked)
   * @permission users:lock
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * await client.admin.users.lock(2, true); // lock
   * await client.admin.users.lock(1, false); // unlock
   * ```
   */
  public lock = async (userID: number, lock: boolean) => { await this.#client.request(`admin/users/${userID}/lock`, { method: "PATCH", body: JSON.stringify({ locked: lock }) }); }
  /**
   * Creates a new user from credentials.
   * 
   * @param body - The username and password to use for the new user
   * @returns The new user's ID
   * @permission users:create
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * const { id } = await client.admin.users.create({ username: "example", password: "meow_mrrp" });
   * ```
   */
  public create = async (body: FHCreateUser): Promise<{ id: number }> => { return await this.#client.request("admin/users", { method: "POST", body: JSON.stringify(body) }); }
  /**
   * Deletes a user.
   * 
   * @param userID - The user's ID
   * @permission users:delete
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   * @example
   * ```ts
   * await client.admin.users.delete(2);
   * ```
   */
  public delete = async (userID: number) => { await this.#client.request(`admin/users/${userID}`, { method: "DELETE" }); }
}

export type FHUserList = { id: number, username: string }[]
export type FHFullUser = { access: "full", username: string, roles: number[], acls: number[], permissions: string[], failedLogins: number, locked: boolean, sessions: FHSession[] }
export type FHLimitedUser = { access: "limited", username: string, failedLogins: number, locked: boolean }
export type FHEditUser = { username?: string, password?: string, clearLoginAttempts?: boolean }
export type FHGrantToUser = ({ id: number, type: "role" | "acl", revoke: boolean } | { id: string, type: "permission", revoke: boolean })[]
export type FHUserEditGrants = { roles?: number[], acls?: number[], permissions?: string[] }
export type FHCreateUser = { username: string, password: string }