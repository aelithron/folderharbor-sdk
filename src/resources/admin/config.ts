import { FolderHarbor, type FHServerConfig } from "../../index.js";

/**
 * Methods for reading and updating a FolderHarbor server's configuration
 */
export class ConfigResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  /**
   * Gets the server's current configuration.
   * 
   * @returns The current configuration of the server
   * @permission config:read
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public read = async (): Promise<FHServerConfig> => { return await this.#client.request<FHServerConfig>(`admin/config`); }
  /**
   * Edits the server's configuration.
   * 
   * @param body - The config settings to change
   * @permission config:edit
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take this admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
  public edit = async (body: Partial<FHServerConfig>) => { await this.#client.request(`admin/config`, { method: "PATCH", body: JSON.stringify(body) }); }
}
