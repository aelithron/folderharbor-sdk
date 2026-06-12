import { FolderHarbor, type FHServerConfig } from "../../index.js";

export class ConfigResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  public read = async (): Promise<FHServerConfig> => { return await this.#client.request<FHServerConfig>(`admin/config`); }
  public edit = async (body: Partial<FHServerConfig>) => { await this.#client.request(`admin/config`, { method: "PATCH", body: JSON.stringify(body) }); }
}
