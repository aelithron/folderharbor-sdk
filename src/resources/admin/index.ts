import { FolderHarbor } from "../..";

export class AdminResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) {
    this.#client = client; 
  }
  public logs = async (page?: number): Promise<FHLogs> => { return await this.#client.request<FHLogs>(`admin/logs${page ? `?page=${page}` : ""}`) }
  public permissions = async (): Promise<FHPermissions> => { return await this.#client.request<FHPermissions>("admin/permissions") }
}

export type FHLogs = { pageCount: number, logs: { userID: number, username: string | null, action: string, body: object | null, blurb: string, createdAt: Date }[] }
export type FHPermissions = { id: string, description: string }[]