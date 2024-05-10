import { BaseException } from './base.exception.js';

export class InternalException extends BaseException {
  constructor(
    errorCode: string = 'INTERNAL_SERVER_ERROR',
    description?: string,
    customData?: Record<string, any>,
  ) {
    super(errorCode, 500, {
      description,
      customData,
    });

    this.name = InternalException.name;
  }
}
