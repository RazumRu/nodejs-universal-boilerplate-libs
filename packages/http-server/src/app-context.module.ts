import { DynamicModule, Global, Scope } from '@nestjs/common';
import { REQUEST_CONTEXT_SERVICE } from './http-server.types';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler';
import { RequestContextService } from './services/request-context.service';
import { RequestContextLogger } from './services/request-context-logger.service';

@Global()
export class AppContextModule {
  static forRoot(): DynamicModule {
    const providers: any = [
      {
        provide: RequestContextService,
        useClass: RequestContextService,
        scope: Scope.REQUEST,
      },
      {
        useExisting: RequestContextService,
        provide: REQUEST_CONTEXT_SERVICE,
      },
      ExceptionHandler,
      RequestContextLogger,
    ];

    return {
      module: AppContextModule,
      exports: providers,
      providers,
    };
  }
}
