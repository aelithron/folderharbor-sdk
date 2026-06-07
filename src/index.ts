import type { FolderHarborConfig } from "../sdk";
import { FHConfigError, FHRequestError, FHUserError } from "./errors";
import { MeResource } from "./resources/me";

export class FolderHarbor {
  #server: string;
  #token: string | undefined;
  constructor(config: FolderHarborConfig) {
    if (!config.server) throw new FHConfigError("Invalid server address");
    this.#server = config.server;
    if (config.token) this.#token = config.token;
    
    this.me = new MeResource(this);
  }
  async request<T>(path: string, init?: RequestInit): Promise<T> {
    let body: object | undefined;
    const url = new URL(this.#server);
    url.pathname += path.split("?")[0];
    if (path.split("?").length >= 2) url.search += path.split("?")[1];
    const headers = new Headers();
    if (this.#token) headers.append("Authorization", `Bearer ${this.#token}`);
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    try {
      const res = await fetch(url.toString(), { ...init, headers });
      if (res.status !== 204) body = await res.json() as object;
    } catch (e) { throw new FHRequestError("Error while fetching from the server", undefined, { cause: e }) }
    if (body && "error" in body) {
      switch(body.error) {
        case "locked":
        case "invalid":
        case "expired":
          throw new FHUserError(`Error from the server: ${(body as { error: string, message: string }).message}`, body.error as string);
        default:
          throw new FHRequestError(`Error from the server: ${(body as { error: string, message: string }).message}`, body.error as string);
      }
    }
    return body as T;
  }

  public auth = {
    login: async (body: FHLogin): Promise<{ token: string }> => {
      const res = await this.request<{ token: string }>("auth", { method: "POST", body: JSON.stringify({ username: body.username, password: body.password }) });
      if (body.persist !== false) this.#token = res.token;
      return { token: res.token };
    },
    logout: async () => {
      await this.request("auth", { method: "DELETE" });
      this.#token = undefined;
    }
  }
  public clientconfig = async (): Promise<FHClientConfig> => { return await this.request<FHClientConfig>("clientconfig"); }
  public protocols = async (): Promise<FHProtocols> => { return await this.request<FHProtocols>("protocols"); }
  public me: MeResource;
}

export type FHLogin = { username: string, password: string, persist?: boolean }
export type FHClientConfig = { selfUsernameChanges: boolean, registration: boolean }
export type FHProtocols = { webdav: string | null, ftp: string | null }