import { FHConfigError, FHRequestError, FHAuthError, FHPermissionError } from "./errors.js";
import { MeResource } from "./resources/me.js";
import { AdminResource } from "./resources/admin/index.js";

/**
 * Core SDK for FolderHarbor's API!
 * 
 * @example
 * ```ts
 * // no auth token
 * const client = new FolderHarbor({ server: "https://demo.fh.novatea.dev" });
 * ```
 * @example
 * ```ts
 * // with auth token
 * const client = new FolderHarbor({ server: "https://demo.fh.novatea.dev", token: "[your token]" });
 * ```
 * @throws {FHConfigError} If the details passed in the constructor are invalid
 */
export class FolderHarbor {
  #server: string;
  #token: string | undefined;
  constructor(config: FolderHarborConfig) {
    if (!config.server) throw new FHConfigError("Invalid server address");
    this.#server = config.server;
    if (config.token) this.#token = config.token;
    
    this.me = new MeResource(this);
    this.admin = new AdminResource(this);
  }
  /**
   * Request wrapper for the other methods, used internally
   * 
   * @param path - The path to fetch on the server, **without a leading slash**!
   * @param init - A request body, this uses the same syntax as the Fetch API
   * @returns The object returned from the API, matching the type that was used in the call
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHPermissionError} If you don't have permission to take a given admin action
   * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
   */
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
          throw new FHAuthError(`Error from the server: ${(body as { error: string, message: string }).message}`, body.error as string);
        case "forbidden":
          throw new FHPermissionError(`Error from the server: ${(body as { error: string, message: string }).message}`, body.error as string);
        default:
          throw new FHRequestError(`Error from the server: ${(body as { error: string, message: string }).message}`, body.error as string);
      }
    }
    return body as T;
  }

  /**
   * Methods to manage user authentication.
   */
  public auth = {
    /**
     * Logs in to a FolderHarbor server using user credentials.
     * 
     * @param body - Login credentials, as well as an option to `persist` the token in the client and use it for future requests (defaults to true)
     * @returns The token that the API responds with
     * @throws {FHRequestError} If anything went wrong, either in the process of requesting, or in the response from the server
     */
    login: async (body: FHLogin): Promise<{ token: string }> => {
      const res = await this.request<{ token: string }>("auth", { method: "POST", body: JSON.stringify({ username: body.username, password: body.password }) });
      if (body.persist !== false) this.#token = res.token;
      return { token: res.token };
    },
    /**
     * Logs out and invalidates the session token.
     * 
     * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
     * @throws {FHRequestError} If anything else went wrong, either in the process of requesting, or in the response from the server
     */
    logout: async () => {
      await this.request("auth", { method: "DELETE" });
      this.#token = undefined;
    },
    /**
     * Registers for a new account on a FolderHarbor server.
     * Note that this will error if the server doesn't have registration enabled! I recommend calling `FolderHarbor#clientconfig()` and checking that registration is enabled.
     * 
     * @param body - Login credentials, as well as an option to `persist` the token in the client and use it for future requests (defaults to true)
     * @returns The token that the API responds with
     * @throws {FHRequestError} If anything went wrong, either in the process of requesting, or in the response from the server
     */
    register: async (body: FHLogin): Promise<{ token: string }> => {
      const res = await this.request<{ token: string }>("auth/register", { method: "POST", body: JSON.stringify({ username: body.username, password: body.password }) });
      if (body.persist !== false) this.#token = res.token;
      return { token: res.token };
    }
  }
  /**
   * Gets information from the server that is important client-side.
   * 
   * @returns The "client configuration" from the server
   * @throws {FHRequestError} If anything went wrong, either in the process of requesting, or in the response from the server
   */
  public clientconfig = async (): Promise<FHClientConfig> => { return await this.request<FHClientConfig>("clientconfig"); }
  /**
   * Gets the connection URLs for different file-transferring protocols.
   * 
   * @returns The connection URLs for any enabled protocols, and null for disabled ones
   * @throws {FHAuthError} If your session is invalid, expired, or for a locked account
   * @throws {FHRequestError} If anything went wrong, either in the process of requesting, or in the response from the server
   */
  public protocols = async (): Promise<FHProtocols> => { return await this.request<FHProtocols>("protocols"); }
  public me: MeResource;
  public admin: AdminResource;
}

export type FHLogin = { username: string, password: string, persist?: boolean }
export type FHClientConfig = { selfUsernameChanges: boolean, registration: boolean }
export type FHProtocols = { webdav: string | null, ftp: string | null }
export interface FolderHarborConfig {
  server: string;
  token?: string | undefined;
}
export type FHSession = { id: number, createdAt: Date, expiry: Date }
export type FHServerConfig = {
  api: {
    port: number,
    ssl: boolean,
    allowedOrigins: string[]
  },
  webdav: {
    enabled: boolean,
    port: number,
    ssl: boolean,
    publicAddress: string | null
  },
  ftp: {
    enabled: boolean,
    port: number,
    ssl: boolean,
    publicAddress: string | null,
    pasv: { address: string | null, start: number, end: number }
  },
  failedLoginLimit: number,
  registration: {
    enabled: boolean,
    readonly defaultRole: number | null
  },
  selfUsernameChanges: boolean,
  filterMetadata: boolean,
  readonly globalExclusions: string[],
  readonly globalExclusionBypasses: string[]
}