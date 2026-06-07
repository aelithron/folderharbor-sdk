export class FHConfigError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, FHConfigError.prototype);
  }
}
export class FHRequestError extends Error {
  public code: string | undefined;
  constructor(message?: string, code?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, FHConfigError.prototype);
  }
}
export class FHUserError extends FHRequestError {
  constructor(message?: string, code?: string, options?: ErrorOptions) {
    super(message, code, options);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, FHConfigError.prototype);
  }
}