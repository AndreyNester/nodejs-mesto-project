import { BaseApiError } from "./BaseApiError";

export class NotFoundError extends BaseApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
