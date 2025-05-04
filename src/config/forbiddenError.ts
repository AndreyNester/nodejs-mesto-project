import AppError from "./appError";

export default class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message || "Не достаточно прав");
    this.statusCode = 403;
  }
}
