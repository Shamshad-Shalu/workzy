class CustomError extends Error {
  statusCode: number;
  errors?: Array<{ field: string; messages: string }>;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Array<{ field: string; messages: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default CustomError;
