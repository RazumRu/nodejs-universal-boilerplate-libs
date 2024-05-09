import { isObject, isString, isUndefined, pickBy } from 'lodash';
import P from 'pino';
import pretty from 'pino-pretty';
import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { ILoggerModuleParams, LogLevel } from './logger.types';

export abstract class BaseLogger
  extends ConsoleLogger
  implements LoggerService
{
  public pino: P.Logger<'system'>;

  protected constructor(public params?: ILoggerModuleParams) {
    super();

    const opt = {
      customLevels: {
        system: 99,
      },
      name: this.params?.appName,
      level: this.params?.level || 'info',
    };

    const stream = pretty({
      colorize: true,
    });

    this.pino = this.params?.prettyPrint ? P(opt, stream) : P(opt);
  }

  public abstract getCustomPayload?(): any;

  private buildPayload({
    msg,
    level,
    err,
    args,
  }: {
    msg: string;
    level: LogLevel;
    err?: Error;
    args?: unknown[];
  }) {
    return pickBy(
      {
        msg,
        error: err
          ? {
              ...err,
              stack: err.stack,
            }
          : undefined,
        level,
        environment: this.params?.environment,
        appName: this.params?.appName,
        appVersion: this.params?.appVersion,
        data: args?.reduce((acc: any, curr: unknown) => {
          if (isObject(curr)) {
            for (const i in curr) {
              acc[i] = (<any>curr)[i];
            }
          } else {
            if (!acc._args) {
              acc._args = [];
            }
            acc._args.push(curr);
          }

          return acc;
        }, {}),
        ...(this.getCustomPayload ? this.getCustomPayload() : {}),
      },
      (v) => !isUndefined(v),
    );
  }

  public system(msg: string, ...args: unknown[]) {
    return this.pino.system(
      this.buildPayload({
        msg,
        level: 'system',
        args,
      }),
    );
  }

  public debug(msg: string, ...args: unknown[]) {
    return this.pino.debug(
      this.buildPayload({
        msg,
        level: 'debug',
        args,
      }),
    );
  }

  public error(err: Error | string, message?: string, ...args: unknown[]) {
    return this.pino.error(
      this.buildPayload({
        msg: message || (!isString(err) ? err.message : err),
        level: 'error',
        args,
        err: !isString(err) ? err : undefined,
      }),
    );
  }

  public log(msg: string, ...args: unknown[]) {
    return this.pino.info(
      this.buildPayload({
        msg,
        level: 'info',
        args,
      }),
    );
  }

  public trace(msg: string, ...args: unknown[]) {
    return this.pino.trace(
      this.buildPayload({
        msg,
        level: 'trace',
        args,
      }),
    );
  }

  public warn(msg: string, ...args: unknown[]) {
    return this.pino.warn(
      this.buildPayload({
        msg,
        level: 'warn',
        args,
      }),
    );
  }
}
