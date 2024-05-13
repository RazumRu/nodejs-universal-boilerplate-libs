# @packages/common

This library provides a Nest module that integrates `ConfigModule`, `Logger`, and additional modules to help bootstrap your application efficiently.

## Example Usage

Below is an example of how to bootstrap an application using the `app-bootstrapper`. 
Make sure to adjust the imports and configuration according to your project's structure and environment settings.

```TypeScript
import { bootstrap } from '@packages/common';
import { AppModule } from './app.module';
import { environment } from './environments';

bootstrap([AppModule], {
  environment: environment.env,
  appName: environment.appName,
  appVersion: environment.appVersion,
  logger: {
    prettyPrint: environment.prettyLog,
    level: environment.logLevel,
    sentryDsn: environment.sentryDsn,
  },
  httpServer: {
    globalPrefix: environment.globalPrefix,
    // globalPrefixIgnore: [`/internal/(.*)`],
    swaggerPath: environment.swaggerPath,
    apiDefaultVersion: '1',
    port: environment.port,
  },
});

```

## Features

`Configurable Logger`: Customize logging with various levels, pretty printing, and Sentry integration.
`HTTP Server Enhancements`: Optionally launch an HTTP server with configurable API versioning, Swagger documentation path, and more.

## Additional Notes
- The `httpServer` parameter enables the HTTP server functionality, based on `@packages/http-server`.


## Configuration Utility: getEnv

The `getEnv` function is a versatile utility for retrieving environment variables with optional default values. It automatically handles type conversions for strings and booleans.

### Usage Example

Integrate getEnv to safely load and default environment variables:

```typescript
import { getEnv } from '@packages/common';

export const environment = {
  env: getEnv('NODE_ENV', 'production'),
  prettyLog: getEnv('PRETTY_LOGS', false),
  booleanVal: getEnv('BOOL_VAL', 'true'), // will convert to boolean
};

```
