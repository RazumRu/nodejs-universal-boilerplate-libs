import { Logger } from '@packages/logger';
import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import * as httpServerTypes from './http-server.types';
import { RequestLoggerModule } from './request-logger.module';
import { HealthCheckerModule } from './health-checker.module';
import { AppContextModule } from './app-context.module';

@Module({})
export class HttpServerModule implements OnModuleInit {
  static forRoot(param: httpServerTypes.IHttpServerInitParams): DynamicModule {
    const providers = [
      {
        provide: httpServerTypes.HTTP_SERVER_OPTIONS,
        useValue: param,
      },
    ];

    return {
      imports: [
        AppContextModule.forRoot(),
        RequestLoggerModule.forRoot(),
        HealthCheckerModule,
      ],
      module: HttpServerModule,
      exports: providers,
      providers,
    };
  }

  constructor(
    @Inject(httpServerTypes.HTTP_SERVER_OPTIONS)
    private readonly params: httpServerTypes.IHttpServerInitParams,
    private readonly logger: Logger,
  ) {}

  onModuleInit(): any {
    this.logger.log(`HTTP server init with port ${this.params.port}`);
  }
}
