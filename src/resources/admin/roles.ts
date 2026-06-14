import { FolderHarbor } from "../../index.js";

/**
 * Methods for reading, listing, and updating roles and their permission and ACL grants.
 */
export class RolesResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  /**
   * Gets the list of roles and their IDs.
   * 
   * @returns A list of roles with their corresponding IDs
   */
  public list = async (): Promise<FHRoleList> => { return await this.#client.request<FHRoleList>("admin/roles"); }
  /**
   * Gets a role's info from its ID.
   * 
   * @param roleID - The role's ID
   * @returns The role's information/details
   */
  public get = async (roleID: number): Promise<FHRole> => { return await this.#client.request<FHRole>(`admin/roles/${roleID}`); }
  /**
   * Edits a role's information.
   * 
   * Note that editing permissions and/or ACLs here **overwrites** them on the role!
   * If you don't know the existing state of these to properly merge your changes, I suggest using {@link grant} instead.
   * 
   * @param roleID - The role's ID
   * @param body - The parts of the role to alter
   */
  public edit = async (roleID: number, body: FHEditRole) => { await this.#client.request(`admin/roles/${roleID}`, { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Grants and revokes ACLs and permissions on a role.
   * 
   * This is intended for cases where you don't already know the current state of these values (such as in a CLI), as it **does not** overwrite.
   * If you do know them (such as in a web panel), see {@link edit} instead.
   * 
   * @param roleID - The role's ID
   * @param body - An array of grantable objects using their IDs, types, and whether to grant or revoke the object
   */
  public grant = async (roleID: number, body: FHGrantToRole) => { await this.#client.request(`admin/roles/${roleID}/grant`, { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Creates a new role.
   * 
   * @param body - The name, and optionally ACLs and permissions, for the new role
   * @returns The new role's ID
   */
  public create = async (body: FHCreateRole): Promise<{ id: number }> => { return await this.#client.request("admin/roles", { method: "POST", body: JSON.stringify(body) }); }
  /**
   * Deletes a role.
   * 
   * @param roleID - The role's ID
   */
  public delete = async (roleID: number) => { await this.#client.request(`admin/roles/${roleID}`, { method: "DELETE" }); }
}

export type FHRoleList = { id: number, name: string }[]
export type FHRole = { name: string, acls: number[], permissions: string[] }
export type FHEditRole = { name?: string, acls?: number[], permissions?: string[] }
export type FHGrantToRole = ({ id: number, type: "acl", revoke: boolean } | { id: string, type: "permission", revoke: boolean })[]
export type FHCreateRole = { name: string, acls?: number[], permissions?: string[] }