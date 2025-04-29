import { BaseApiError } from "./BaseApiError";

export class AuthError extends BaseApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
