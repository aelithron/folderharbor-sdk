import type { FolderHarborConfig } from "../sdk";
import { FHConfigError, FHRequestError, FHUserError } from "./errors";

export class FolderHarbor {
  private server: string;
  private apiKey: string | undefined;
  constructor(config: FolderHarborConfig) {
    if (!config.server) throw new FHConfigError("Invalid server address");
    this.server = config.server;
    if (config.key) this.apiKey = config.key;
  }
  async request<T>(path: string, init?: RequestInit): Promise<T> {
    let body: object | undefined;
    const url = new URL(this.server);
    url.pathname += path.split("?")[0];
    if (path.split("?").length >= 2) url.search += path.split("?")[1];
    const headers = new Headers();
    if (this.apiKey) headers.append("Authorization", `Bearer ${this.apiKey}`);
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    try {
      const res = await fetch(url.toString(), { ...init, headers });
      if (res.status !== 204) body = await res.json() as object;
    } catch (e) { throw new FHRequestError("Error while fetching from the server", { cause: e }) }
    if (body && "error" in body) {
      switch(body.error) {
        case "locked":
          throw new FHUserError("User account is locked");
        case "invalid":
        case "expired":
          throw new FHUserError(`Session token is ${body.error}`);
        default:
          throw new FHRequestError(`Error from the server: ${body.error}`);
      }
    }
    return body as T;
  }
}