import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(
    errorCode: string = 'UNAUTHORIZED',
    description?: string,
    customData?: Record<string, any>,
  ) {
    super(errorCode, 401, {
      description,
      customData,
    });

    this.name = UnauthorizedException.name;
  }
}
