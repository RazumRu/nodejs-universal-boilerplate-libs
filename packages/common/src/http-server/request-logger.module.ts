import { DynamicModule, Global, MiddlewareConsumer } from '@nestjs/common';
import { FastifyLoggingMiddleware } from './middleware/log.middleware';

@Global()
export class RequestLoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: RequestLoggerModule,
      providers: [],
      exports: [],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FastifyLoggingMiddleware).forRoutes('*');
  }
}
