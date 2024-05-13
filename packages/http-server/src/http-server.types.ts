import { IExceptionData } from '@packages/exceptions';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ISentryLogData } from '@packages/logger';

export interface IHttpServerInitParams {
  globalPrefix?: string;
  globalPrefixIgnore?: string[];
  swaggerPath?: string;
  swaggerDescription?: string;
  apiDefaultVersion?: string;
  appName: string;
  appVersion: string;
  port?: number;
  fastifyOptions?: ConstructorParameters<typeof FastifyAdapter>[0];
}

export const HTTP_SERVER_OPTIONS = Symbol('HTTP_SERVER_OPTIONS');
export const REQUEST_CONTEXT_SERVICE = Symbol('REQUEST_CONTEXT_SERVICE');

export interface IRequestData {
  userId?: string;
  requestId: string;
  ip: string;
  method: string;
  body: any;
  url: string;
}

export interface ISentryExceptionData
  extends Partial<IRequestData>,
    IExceptionData {
  level: ISentryLogData['level'];
}

export enum HealthStatus {
  Ok = 'Ok',
  Failed = 'Failed',
}
