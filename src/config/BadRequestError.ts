import BaseApiError from './BaseApiError';

export default class BadRequestError extends BaseApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}
