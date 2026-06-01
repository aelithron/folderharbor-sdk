import type { FolderHarborConfig } from "../sdk";
import { FHConfigError } from "./errors";

export class FolderHarbor {
  private server: string;
  private apiKey: string | undefined;
  constructor(config: FolderHarborConfig) {
    if (!config.server) throw new FHConfigError("Invalid server address");
    this.server = config.server;
    if (config.key) this.apiKey = config.key;
  }
}