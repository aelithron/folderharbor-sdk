import { FolderHarbor } from "../..";

export class RolesResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  public list = async (): Promise<FHRoleList> => { return await this.#client.request<FHRoleList>("admin/roles"); }
  public get = async (id: number): Promise<FHRole> => { return await this.#client.request<FHRole>(`admin/roles/${id}`); }
  public edit = async (id: number, body: FHEditRole) => { await this.#client.request(`admin/acls/${id}`, { method: "PATCH", body: JSON.stringify(body) }); }
  public grant = async (id: number, body: FHGrantToRole) => { await this.#client.request(`admin/roles/${id}/grant`, { method: "PATCH", body: JSON.stringify(body) }); }
  public create = async (body: FHCreateRole): Promise<{ id: number }> => { return await this.#client.request("admin/roles", { method: "POST", body: JSON.stringify(body) }); }
  public delete = async (id: number) => { await this.#client.request(`admin/roles/${id}`, { method: "DELETE" }); }
}

export type FHRoleList = { id: number, name: string }[]
export type FHRole = { name: string, acls: number[], permissions: string[] }
export type FHEditRole = { name?: string, acls?: number[], permissions?: string[] }
export type FHGrantToRole = ({ id: number, type: "acl", revoke: boolean } | { id: string, type: "permission", revoke: boolean })[]
export type FHCreateRole = { name: string, acls?: number[], permissions?: string[] }