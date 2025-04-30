import BaseApiError from './BaseApiError';

export default class NotFoundError extends BaseApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
