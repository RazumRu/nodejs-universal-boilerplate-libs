import {
  ClassSerializerInterceptor,
  DynamicModule,
  INestApplication,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFactory, Reflector } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import rTracer from 'cls-rtracer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getVersion } from './utils';
import { RequestContextService } from './services/request-context.service';
import { IHttpServerInitParams } from './http-server.types';
import qs from 'fastify-qs';
import { ValidationPipe } from './pipes/validation.pipe';
import helmet from 'helmet';
import multipart from '@fastify/multipart';
import { apiReference } from '@scalar/nestjs-api-reference';
import { HttpServerModule } from './http-server.module';

export { getVersion, RequestContextService };
export * from './http-server.types';
export * from './pipes/array-validation.pipe';
export * from './pipes/validation.pipe';
export * from './services/exception-handler';
export * from './services/request-context-logger.service';

const setupSwagger = (
  app: INestApplication,
  {
    path = '/swagger-api',
    appName,
    version,
    description,
  }: {
    path: string;
    appName: string;
    version: string;
    description?: string;
  },
) => {
  const config = new DocumentBuilder()
    .setTitle(appName)
    .setVersion(version)
    .addBearerAuth();

  if (description) {
    config.setDescription(description);
  }

  const document = SwaggerModule.createDocument(app, config.build(), {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    // ignoreGlobalPrefix: true
  });
  const swp = [path].join('/').replace(/\/{1,}/g, '/');

  SwaggerModule.setup(swp, app, document);

  app.use(
    `${swp}/reference`,
    apiReference({
      spec: {
        url: '/swagger-api-json',
      },
      layout: 'modern',
      withFastify: true,
      showSidebar: true,
      darkMode: true,
    }),
  );
};

const setupMiddlewares = (app: INestApplication) => {
  // if (sentryService.isSentryInit && param.logger?.sentry?.enabledHttpTracing) {
  //   app.use(Sentry.Handlers.requestHandler());
  // }
  const adapter = app.getHttpAdapter();

  adapter.getInstance().register(qs, { comma: true });

  app.useGlobalFilters(new AllExceptionsFilter(app));

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();
  app.use(helmet({ contentSecurityPolicy: false }));

  adapter.getInstance().register(multipart);
  app.use(
    rTracer.fastifyMiddleware({
      useHeader: true,
      echoHeader: true,
      headerName: 'X-Request-Id',
    }),
  );
};

const setupPrefix = (
  app: INestApplication,
  {
    apiDefaultVersion,
    globalPrefix,
    globalPrefixIgnore,
  }: Pick<
    IHttpServerInitParams,
    'apiDefaultVersion' | 'globalPrefix' | 'globalPrefixIgnore'
  >,
) => {
  const resultVersion = getVersion(apiDefaultVersion);

  if (resultVersion) {
    app.enableVersioning({
      defaultVersion: resultVersion,
      prefix: false,
      type: VersioningType.URI,
    });
  }

  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix, {
      exclude: [
        {
          path: '/health/check',
          method: RequestMethod.ALL,
        },
        ...[...(globalPrefixIgnore || [])].map((c) => ({
          path: c,
          method: RequestMethod.ALL,
        })),
      ],
    });
  }
};

export const bootstrapHttpServer = async (
  appBootstrapperModule: DynamicModule,
  params: IHttpServerInitParams,
) => {
  const httpModule = HttpServerModule.forRoot(params);

  if (appBootstrapperModule.imports) {
    appBootstrapperModule.imports.push(httpModule);
  } else {
    appBootstrapperModule.imports = [httpModule];
  }

  const adapter = new FastifyAdapter(params.fastifyOptions);
  const app = await NestFactory.create(appBootstrapperModule, <any>adapter);

  setupMiddlewares(app);
  setupPrefix(app, {
    apiDefaultVersion: params.apiDefaultVersion,
    globalPrefix: params.globalPrefix,
    globalPrefixIgnore: params.globalPrefixIgnore,
  });

  if (params.swaggerPath) {
    setupSwagger(app, {
      path: params.swaggerPath,
      appName: params.appName,
      version: params.appVersion,
      description: params.swaggerDescription,
    });
  }

  const port = params.port || 3000;
  await (<INestApplication>app).listen(port, '0.0.0.0');
};
