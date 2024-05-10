import { BaseException } from './base.exception.js';

export class BadRequestException extends BaseException {
  constructor(
    errorCode: string = 'BAD_REQUEST',
    description?: string,
    customData?: Record<string, any>,
  ) {
    super(errorCode, 400, {
      description,
      customData,
    });

    this.name = BadRequestException.name;
  }
}
