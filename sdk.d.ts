export interface FolderHarborConfig {
  server: string;
  token?: string | undefined;
}
export type FHSession = { id: number, createdAt: Date, expiry: Date }
export type FHServerConfig = {
  readonly database: string,
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