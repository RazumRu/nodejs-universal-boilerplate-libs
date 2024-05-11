import { BaseException } from '@packages/exceptions';
import { BaseLogger, LOGGER, SentryService } from '@packages/logger';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import { ISentryExceptionData } from '../http-server.types';

@Injectable()
export class ExceptionHandler {
  constructor(
    private readonly requestContextService: RequestContextService,
    @Inject(LOGGER)
    private readonly logger: BaseLogger,
    private readonly sentryService: SentryService,
  ) {}

  public getSentryExceptionData(exception: any): ISentryExceptionData {
    const requestData = this.requestContextService.getRequestData();
    const exceptionData = BaseException.getExceptionData(exception);

    return {
      ...requestData,
      ...exceptionData,
      level:
        exceptionData.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
          ? 'error'
          : 'warning',
    };
  }

  public handle(exception: any, message?: string): ISentryExceptionData {
    const data = this.getSentryExceptionData(exception);

    const realMessage = message || data.message;

    this.logger.error(exception, realMessage, {
      ...data,
    });

    if (data.statusCode >= HttpStatus.BAD_REQUEST) {
      this.sentryService.send(exception, data);
    }

    return data;
  }
}
