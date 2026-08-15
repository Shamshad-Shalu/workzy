export class ApiError extends Error {
  public statusCode: number;
  public errors?: Array<{ field: string; messages: string }>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Array<{ field: string; messages: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}
