import { BaseException } from './base.exception.js';

export class NotFoundException extends BaseException {
  constructor(
    errorCode: string = 'NOT_FOUND',
    description?: string,
    customData?: Record<string, any>,
  ) {
    super(errorCode, 404, {
      description,
      customData,
    });

    this.name = NotFoundException.name;
  }
}
