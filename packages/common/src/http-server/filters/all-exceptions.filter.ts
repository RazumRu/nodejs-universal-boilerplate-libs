import { Logger, SentryService } from '@packages/logger';
import * as common from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { RequestContextService } from '../services/request-context.service';
import { ExceptionHandler } from '../services/exception-handler';

@common.Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly moduleRef: common.INestApplication) {
    const applicationRef = <common.HttpServer>moduleRef.get(HttpAdapterHost);

    super(applicationRef);
  }

  async catch(exception: any, host: common.ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const sentryService = this.moduleRef.get(SentryService);
    const logger = this.moduleRef.get(Logger);

    const exceptionHandler = new ExceptionHandler(
      new RequestContextService(request),
      logger,
      sentryService,
    );

    const data = exceptionHandler.handle(exception);

    response.status(data.statusCode).send({
      statusCode: data.statusCode,
      code: data.code,
      message: data.message,
      fullMessage: data.fullMessage,
      fields: data.fields,
    });
  }
}
