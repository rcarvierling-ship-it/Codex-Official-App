export class AccessDeniedError extends Error {
  constructor(message = "Access denied: Out of scope") {
    super(message);
    this.name = "AccessDeniedError";
  }
}
