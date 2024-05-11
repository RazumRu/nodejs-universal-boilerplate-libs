import { ILoggerModuleParams } from '@packages/logger';
import { IHttpServerInitParams } from './http-server/http-server.types';

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
