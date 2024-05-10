import { BaseException } from './base.exception.js';

export class ForbiddenException extends BaseException {
  constructor(
    errorCode: string = 'FORBIDDEN',
    description?: string,
    customData?: Record<string, any>,
  ) {
    super(errorCode, 403, {
      description,
      customData,
    });

    this.name = ForbiddenException.name;
  }
}
