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
   */
  public list = async (): Promise<FHUserList> => { return await this.#client.request<FHUserList>("admin/users"); }
  /**
   * Gets a user from their ID.
   * 
   * @param userID - The user's ID
   * @returns The user's information, either full or limited depending on your permission level.
   */
  public get = async (userID: number): Promise<FHFullUser | FHLimitedUser> => { return await this.#client.request<FHFullUser | FHLimitedUser>(`admin/users/${userID}`); }
  /**
   * Edits a user's information.
   * This method is limited to their username, password, and clearing their failed logins.
   * 
   * @param userID - The user's ID
   * @param body - The information to change / updates to make
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
   */
  public grant = async (userID: number, body: FHGrantToUser) => { await this.#client.request(`admin/users/${userID}/grant`, { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Grants and revokes roles, ACLs, and permissions on a user directly.
   * 
   * This is intended for if you know the current state of these values (such as in a web panel), as it **does overwrite** their current states.
   * If you don't know them (such as in a CLI), see {@link grant} instead.
   * 
   * @param userID - The user's ID
   * @param body - Arrays of the role, ACL, and permission IDs to apply to the user (omitting an array will ignore updating that data)
   */
  public editGrants = async (userID: number, body: FHUserEditGrants) => { await this.#client.request(`admin/users/${userID}/grant`, { method: "PUT", body: JSON.stringify(body) }); }
  /**
   * Locks or unlocks a user's account.
   * 
   * @param userID - The user's ID
   * @param lock - Whether to lock or unlock the account (true = locked, false = unlocked)
   */
  public lock = async (userID: number, lock: boolean) => { await this.#client.request(`admin/users/${userID}/lock`, { method: "PATCH", body: JSON.stringify({ locked: lock }) }); }
  /**
   * Creates a new user from credentials.
   * 
   * @param body - The username and password to use for the new user
   * @returns The new user's ID
   */
  public create = async (body: FHCreateUser): Promise<{ id: number }> => { return await this.#client.request("admin/users", { method: "POST", body: JSON.stringify(body) }); }
  /**
   * Deletes a user.
   * 
   * @param userID - The user's ID
   */
  public delete = async (userID: number) => { await this.#client.request(`admin/users/${userID}`, { method: "DELETE" }); }
}

export type FHUserList = { id: number, username: string }[]
export type FHFullUser = { access: "full", username: string, roles: number[], acls: number[], permissions: string[], failedLogins: number, locked: boolean, sessions: FHSession[] }
export type FHLimitedUser = { access: "limited", username: string, failedLogins: number, locked: boolean }
export type FHEditUser = { username?: string, password?: string, clearFailedLogins?: boolean }
export type FHGrantToUser = ({ id: number, type: "role" | "acl", revoke: boolean } | { id: string, type: "permission", revoke: boolean })[]
export type FHUserEditGrants = { roles?: number[], acls?: number[], permissions?: string[] }
export type FHCreateUser = { username: string, password: string }