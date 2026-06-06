export class ApiResponse {
  statusCode: number;
  data: unknown;
  message: string;
  success: boolean;

  constructor(data = null, message = "Success", statusCode = 200) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
  }
}
