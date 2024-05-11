import { BaseLogger, Logger } from '@packages/logger';
import { Injectable } from '@nestjs/common';
import { RequestContextService } from './request-context.service';

@Injectable()
export class RequestContextLogger extends BaseLogger {
  constructor(
    private readonly logger: Logger,
    private readonly requestContextService: RequestContextService,
  ) {
    super(logger.params);
  }

  public getCustomPayload() {
    const requestData = this.requestContextService.getRequestData();

    return {
      ...requestData,
      ...this.logger.getCustomPayload(),
    };
  }
}
