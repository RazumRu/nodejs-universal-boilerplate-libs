import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@packages/logger';
import { IAppBootstrapperParams } from './app-bootstrapper.types';

@Module({})
export class AppBootstrapperModule {
  static forRoot(
    bootstrapModules: any[],
    params: IAppBootstrapperParams,
  ): DynamicModule {
    return {
      module: AppBootstrapperModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [`${process.cwd()}/.env`],
        }),
        LoggerModule.forRoot({
          ...(params.logger || {}),
          environment: params.environment,
          appName: params.appName,
          appVersion: params.appVersion,
        }),
        ...bootstrapModules,
      ],
      controllers: [],
    };
  }
}
