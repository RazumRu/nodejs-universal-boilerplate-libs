import * as Sentry from '@sentry/node';
import {
  ILoggerModuleParams,
  ISentryLogData,
  LOGGER_PARAMS,
} from './logger.types';
import { extraErrorDataIntegration } from '@sentry/integrations';
import * as process from 'process';
import { isObject } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from './logger';

@Injectable()
export class SentryService {
  private isSentryInit = false;

  constructor(
    @Inject(LOGGER_PARAMS)
    public readonly loggerParams: ILoggerModuleParams | undefined,
    private readonly logger: Logger,
  ) {}

  public send(err: Error, data?: ISentryLogData) {
    if (!this.isSentryInit) {
      return;
    }

    const scope = Sentry.getCurrentScope();

    if (isObject(data?.data)) {
      scope.setExtra('data', data?.data);
    }

    if (data?.message) {
      scope.setExtra('message', data.message);
    }

    if (data?.userId) {
      scope.setUser({
        userID: data.userId,
        username: String(data.userId),
      });
    }

    if (data?.requestId) {
      scope.setTag('requestId', data.requestId);
    }

    if (data?.operationId) {
      scope.setTag('operationId', data.operationId);
    }

    if (data?.errorCode) {
      scope.setTag('errorCode', data.code);
    }

    if (data?.statusCode) {
      scope.setTag('statusCode', data.statusCode);
    }

    if (this.loggerParams?.appVersion) {
      scope.setTag('appVersion', this.loggerParams?.appVersion);
    }

    if (this.loggerParams?.appName) {
      scope.setTag('appName', this.loggerParams?.appName);
    }

    if (this.loggerParams?.environment) {
      scope.setTag('environment', this.loggerParams?.environment);
    }

    scope.setLevel(data?.level || 'error');

    Sentry.captureException(err);
  }

  public init(dsn: string) {
    this.logger.system('Init sentry');

    Sentry.init({
      environment: this.loggerParams?.environment,
      dsn,
      normalizeDepth: 11,
      integrations: [
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: (err) => {
            this.logger.error(err, 'Uncaught exception');
            setTimeout(() => process.exit(1), 10);
          },
        }),
        // unfortunately, sentry does not provide a way to add additional tags to record,
        // that can be useful to track records within whole application
        extraErrorDataIntegration({ depth: 10 }),
      ],
    });

    this.isSentryInit = true;
  }
}
