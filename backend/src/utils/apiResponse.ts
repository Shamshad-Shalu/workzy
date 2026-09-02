export class ApiResponse<T = unknown> {
  public success = true;
  public message: string;
  public data: T;

  constructor(data: T = null as unknown as T, message: string = "Success") {
    this.data = data;
    this.message = message;
  }
}
