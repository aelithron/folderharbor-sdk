import { FolderHarbor } from "../..";
import type { FHSession } from "../../../sdk";

export class UsersResource {
  #client: FolderHarbor;
  constructor(client: FolderHarbor) { this.#client = client; }
  public list = async (): Promise<FHUserList> => { return await this.#client.request<FHUserList>("admin/users"); }
  public get = async (id: number): Promise<FHFullUser | FHLimitedUser> => { return await this.#client.request<FHFullUser | FHLimitedUser>(`admin/users/${id}`); }
  public create = async (body: FHCreateUser): Promise<{ id: number }> => { return await this.#client.request("admin/users", { method: "POST", body: JSON.stringify(body) }); }
  public delete = async (id: number) => { return await this.#client.request(`admin/users/${id}`, { method: "DELETE" }); }
}

export type FHUserList = { id: number, username: string }[]
export type FHFullUser = { access: "full", username: string, roles: number[], acls: number[], permissions: string[], failedLogins: number, locked: boolean, sessions: FHSession[] }
export type FHLimitedUser = { access: "limited", username: string, failedLogins: number, locked: boolean }
export type FHCreateUser = { username: string, password: string }