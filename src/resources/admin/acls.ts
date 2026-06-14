import { FolderHarbor } from "../../index.js";

/**
 * Methods for reading, listing, and updating Access Control Lists (ACLs).
 */
export class ACLsResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  /**
   * Gets the list of ACLs and their IDs.
   * 
   * @returns A list of ACLs with their corresponding IDs
   * @permission acls:list
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public list = async (): Promise<FHACLList> => { return await this.#client.request<FHACLList>("admin/acls"); }
  /**
   * Gets an ACL's info from its ID.
   * 
   * @param aclID - The ACL's ID
   * @returns The ACL's information/details
   * @permission acls:read
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public get = async (aclID: number): Promise<FHACL> => { return await this.#client.request<FHACL>(`admin/acls/${aclID}`); }
  /**
   * Edits an ACL's information.
   * 
   * Note that editing allow/deny paths here **overwrites** them on the ACL!
   * If you don't know the existing state of these to properly merge your changes, I suggest using {@link editPaths} instead.
   * 
   * @param aclID - The ACL's ID
   * @param body - The parts of the ACL to alter
   * @permission acls:edit
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public edit = async (aclID: number, body: FHEditACL) => { await this.#client.request(`admin/acls/${aclID}`, { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Edits an ACL's allow and deny paths.
   * 
   * This method **does not overwrite** these paths on the ACL, it will merge them into the existing ones.
   * If you know the existing state of these, I suggest using {@link edit} instead.
   * 
   * @param aclID - The ACL's ID
   * @param body - The parts of the ACL to alter
   * @permission acls:edit
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public editPaths = async (aclID: number, body: FHEditACLPaths) => { await this.#client.request(`admin/acls/${aclID}/paths`, { method: "PATCH", body: JSON.stringify(body) }); }
  /**
   * Creates an ACL.
   * 
   * @param body - The name, and optionally allow and deny paths, for the new ACL
   * @returns The new ACL's ID
   * @permission acls:create
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public create = async (body: FHCreateACL): Promise<{ aclID: number }> => { return await this.#client.request("admin/acls", { method: "POST", body: JSON.stringify(body) }); }
  /**
   * Deletes an ACL.
   * 
   * @param aclID - The ACL's ID
   * @permission acls:delete
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public delete = async (aclID: number) => { await this.#client.request(`admin/acls/${aclID}`, { method: "DELETE" }); }
}

export type FHACLList = { id: number, name: string }[]
export type FHACL = { name: string, allow: string[], deny: string[] }
export type FHEditACL = { name?: string, allow?: string[], deny?: string[] }
export type FHEditACLPaths = { path: string, type: "allow" | "deny", delete: boolean }[]
export type FHCreateACL = { name: string, allow?: string[], deny?: string[] }