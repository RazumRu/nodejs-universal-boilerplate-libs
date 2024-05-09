import { BaseLogger } from './base-logger';
import { networkInterfaces } from 'os';
import { ILoggerModuleParams, LOGGER_PARAMS } from './logger.types';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class Logger extends BaseLogger {
  private networkInterfaces = networkInterfaces();

  constructor(
    @Inject(LOGGER_PARAMS)
    public readonly loggerParams?: ILoggerModuleParams,
  ) {
    super(loggerParams);
  }

  private getLocalIp(): string {
    for (const devName in this.networkInterfaces) {
      const iface = this.networkInterfaces[devName] || [];

      for (const alias of iface) {
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }

    return '';
  }

  public getCustomPayload() {
    return {
      instanceIp: this.getLocalIp(),
    };
  }
}
