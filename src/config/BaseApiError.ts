export abstract class BaseApiError extends Error {
  public statusCode: number = 500;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
