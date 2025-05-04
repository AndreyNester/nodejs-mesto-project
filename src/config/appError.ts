export default abstract class AppError extends Error {
  protected statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}
