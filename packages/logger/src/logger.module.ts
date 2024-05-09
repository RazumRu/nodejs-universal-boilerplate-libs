import { ILoggerModuleParams, LOGGER, LOGGER_PARAMS } from './logger.types';
import { Logger } from './logger';
import { SentryService } from './sentry.service';
import { DynamicModule, Global } from '@nestjs/common';

@Global()
export class LoggerModule {
  static forRoot(param?: ILoggerModuleParams): DynamicModule {
    const providers: any = [
      {
        provide: LOGGER_PARAMS,
        useValue: param,
      },
      Logger,
      SentryService,
    ];

    if (param?.customInstance) {
      providers.push(param.customInstance);
      providers.push({
        provide: LOGGER,
        useExisting: param?.customInstance,
      });
    } else {
      providers.push({
        provide: LOGGER,
        useExisting: Logger,
      });
    }

    return {
      module: LoggerModule,
      exports: providers,
      providers,
    };
  }
}
