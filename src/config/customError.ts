import AppError from "./appError";

export default class CustomError extends AppError {
  constructor(params: { message: string; statusCode: number }) {
    super(params.message);
    this.message = params.message;
    this.statusCode = params.statusCode;
  }
}
