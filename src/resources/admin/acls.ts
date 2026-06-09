import { FolderHarbor } from "../../index.js";

export class ACLsResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  public list = async (): Promise<FHACLList> => { return await this.#client.request<FHACLList>("admin/acls"); }
  public get = async (id: number): Promise<FHACL> => { return await this.#client.request<FHACL>(`admin/acls/${id}`); }
  public edit = async (id: number, body: FHEditACL) => { await this.#client.request(`admin/acls/${id}`, { method: "PATCH", body: JSON.stringify(body) }); }
  public editPaths = async (id: number, body: FHEditACLPaths) => { await this.#client.request(`admin/acls/${id}/paths`, { method: "PATCH", body: JSON.stringify(body) }); }
  public create = async (body: FHCreateACL): Promise<{ id: number }> => { return await this.#client.request("admin/acls", { method: "POST", body: JSON.stringify(body) }); }
  public delete = async (id: number) => { await this.#client.request(`admin/acls/${id}`, { method: "DELETE" }); }
}

export type FHACLList = { id: number, name: string }[]
export type FHACL = { name: string, allow: string[], deny: string[] }
export type FHEditACL = { name?: string, allow?: string[], deny?: string[] }
export type FHEditACLPaths = { path: string, type: "allow" | "deny", delete: boolean }[]
export type FHCreateACL = { name: string, allow?: string[], deny?: string[] }