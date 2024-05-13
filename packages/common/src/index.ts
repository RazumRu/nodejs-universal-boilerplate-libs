import { AppBootstrapperModule } from './app-bootstrapper.module';
import { NestFactory } from '@nestjs/core';
import { IAppBootstrapperParams } from './app-bootstrapper.types';
import { boolean, isBooleanable } from 'boolean';
import { isUndefined } from 'lodash';
import { bootstrapHttpServer } from '@packages/http-server';

export { AppBootstrapperModule };

export const bootstrap = (modules: any[], params: IAppBootstrapperParams) => {
  (async () => {
    const appBootstrapperModule = AppBootstrapperModule.forRoot(
      modules,
      params,
    );

    if (params.httpServer) {
      await bootstrapHttpServer(appBootstrapperModule, {
        ...params.httpServer,
        appName: params.appName,
        appVersion: params.appVersion,
      });
    } else {
      const app = await NestFactory.createApplicationContext(
        appBootstrapperModule,
      );

      await app.init();

      if (!params.httpServer) {
        await app.close();

        setTimeout(process.exit, 3000, 0);
      }
    }
  })().catch((err: Error) => {
    console.error({ err }, "Server didn't start, something went wrong 💔");

    setTimeout(process.exit, 1100, 1);
  });
};

export const getEnv = <T extends string | boolean>(
  env: string,
  value?: T,
): T => {
  const v = isUndefined(process.env[env]) ? value : process.env[env];

  return <T>(isBooleanable(v) ? boolean(v) : v);
};
