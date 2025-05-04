import AppError from "./appError";

export default class BadRequestError extends AppError {
  constructor(message?: string) {
    super(message || "Не корректно переданы данные");
    this.statusCode = 400;
  }
}
