export default class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errors?: Array<{ field: string; messages: string }>
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
