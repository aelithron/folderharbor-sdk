/**
 * Error thrown for configuration errors when initializing the FolderHarbor SDK.
 */
export class FHConfigError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, FHConfigError.prototype);
  }
}
/**
 * Error thrown when a fetch fails, or when the server responds with an error.
 */
export class FHRequestError extends Error {
  /**
   * The server's error code, if applicable
   */
  public code: string | undefined;
  constructor(message?: string, code?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, FHRequestError.prototype);
  }
}
/**
 * Error thrown when your session is invalid, expired, or for a locked account, when fetching for a route that requires authentication.
 */
export class FHAuthError extends FHRequestError {
  constructor(message?: string, code?: string, options?: ErrorOptions) {
    super(message, code, options);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, FHAuthError.prototype);
  }
}
/**
 * Error thrown when the authenticated user doesn't have permission to take the admin action that was attempted.
 */
export class FHPermissionError extends FHRequestError {
  constructor(message?: string, code?: string, options?: ErrorOptions) {
    super(message, code, options);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, FHAuthError.prototype);
  }
}