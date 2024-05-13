import { IHttpServerInitParams } from '@packages/http-server';
import { ILoggerModuleParams } from '@packages/logger';

export interface IAppBootstrapperParams {
  environment: string;
  appName: string;
  appVersion: string;
  httpServer?: Omit<
    IHttpServerInitParams,
    'environment' | 'appName' | 'appVersion'
  >;
  logger?: Omit<ILoggerModuleParams, 'environment' | 'appName' | 'appVersion'>;
}
