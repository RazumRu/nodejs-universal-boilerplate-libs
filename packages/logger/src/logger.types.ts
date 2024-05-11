import { LevelWithSilent } from 'pino';
import { SeverityLevel } from '@sentry/types';
import { BaseLogger } from './base-logger';

export type LogLevel = LevelWithSilent | 'system';

export interface ILoggerModuleParams {
  prettyPrint?: boolean;
  sentryDsn?: string;
  level?: LogLevel;
  customInstance?: new (...args: any[]) => BaseLogger;
  environment: string;
  appName: string;
  appVersion: string;
}

export interface ISentryLogData {
  data?: any;
  userId?: string;
  requestId?: string;
  operationId?: string;
  level?: SeverityLevel;
  errorCode?: string;
  statusCode?: number;
  message?: string;
  [key: string]: any;
}

export const LOGGER_PARAMS = Symbol('LOGGER_PARAMS');
export const LOGGER = Symbol('LOGGER');
