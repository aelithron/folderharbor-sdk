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
   */
  public read = async (): Promise<FHServerConfig> => { return await this.#client.request<FHServerConfig>(`admin/config`); }
  /**
   * Edits the server's configuration.
   * 
   * @param body - The config settings to change
   */
  public edit = async (body: Partial<FHServerConfig>) => { await this.#client.request(`admin/config`, { method: "PATCH", body: JSON.stringify(body) }); }
}
