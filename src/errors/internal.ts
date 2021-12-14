export class InternalError extends Error {
  code: string;

  message: string;

  error: any;

  constructor(code: string, message: string, error: any) {
    super();
    this.code = code;
    this.message = message;
    this.error = error;
  }
}
