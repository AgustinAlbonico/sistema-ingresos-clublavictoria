export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    // This is needed to make the stack trace cleaner
    Error.captureStackTrace(this, this.constructor);
  }
}
