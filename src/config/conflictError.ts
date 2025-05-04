import AppError from "./appError";

export default class ConflictError extends AppError {
  constructor(message?: string) {
    super(message || "Уже существует такое");
    this.statusCode = 409;
  }
}
