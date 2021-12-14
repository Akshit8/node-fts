export class APIError extends Error {
  status_code: number;

  error: boolean;

  message: string;

  constructor(statusCode?: number, error?: boolean, message?: string) {
    super();
    this.status_code = statusCode || 500;
    this.error = error || true;
    this.message = message || "Internal Server error";
  }
}

export class BadRequestError extends APIError {
  constructor(message?: string) {
    const msg = message || "Bad request";
    super(400, true, msg);
  }
}

export class NotFoundError extends APIError {
  constructor(message?: string) {
    const msg = message || "Requested resource not found on server";
    super(404, true, msg);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message?: string) {
    const msg = message || "Unauthorized request";
    super(401, true, msg);
  }
}

export class ForbidenError extends APIError {
  constructor(message?: string) {
    const msg = message || "Requested resource is forbidden";
    super(403, true, msg);
  }
}
