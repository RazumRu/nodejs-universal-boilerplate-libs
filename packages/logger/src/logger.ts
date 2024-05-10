import { BaseLogger } from './base-logger.js';
import { networkInterfaces } from 'os';
import * as loggerTypes from './logger.types.js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class Logger extends BaseLogger {
  private networkInterfaces = networkInterfaces();

  constructor(
    @Inject(loggerTypes.LOGGER_PARAMS)
    public readonly loggerParams?: loggerTypes.ILoggerModuleParams,
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
