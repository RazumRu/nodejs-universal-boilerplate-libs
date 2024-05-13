import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseLogger, LOGGER } from '@packages/logger';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class FastifyLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(LOGGER)
    private readonly logger: BaseLogger,
  ) {}

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const { method, originalUrl } = req;

    this.logger.log(`Request ${method}: ${originalUrl}`);

    next();
  }
}
