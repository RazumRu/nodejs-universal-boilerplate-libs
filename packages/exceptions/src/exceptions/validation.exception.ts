import { BaseException } from './base.exception.js';
import { IExceptionFieldError } from '@packages/exceptions';

export class ValidationException extends BaseException {
  constructor(
    errorCode: string = 'VALIDATION_ERROR',
    description?: string,
    public fields?: IExceptionFieldError[],
    customData?: Record<string, any>,
  ) {
    super(errorCode, 403, {
      description,
      customData,
      fields,
    });

    this.name = ValidationException.name;
  }
}
