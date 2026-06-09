export interface FolderHarborConfig {
  server: string;
  token?: string | undefined;
}
export type FHSession = { id: number, createdAt: Date, expiry: Date }