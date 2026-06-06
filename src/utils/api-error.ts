class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: unknown[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: unknown[] = [],
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default ApiError;
