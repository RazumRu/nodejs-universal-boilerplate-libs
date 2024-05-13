# @packages/http-server

This library provides a NestJS module for setting up an HTTP server using `Fastify`. It is seamlessly integrated into the `@packages/common` library and is activated when the `httpServer` parameter is passed.

## Getting Started

To configure and run your HTTP server, include the setup in your application bootstrap:


```typescript
import { bootstrap } from '@packages/common';
import { AppModule } from './app.module';
import { environment } from './environments';

bootstrap([AppModule], {
  environment: environment.env,
  appName: environment.appName,
  appVersion: environment.appVersion,
  httpServer: {
    globalPrefix: environment.globalPrefix,
    swaggerPath: environment.swaggerPath,
    apiDefaultVersion: '1',
    port: environment.port,
  },
});

```

## Features

### Health Checker

This module includes a health check controller that provides a `GET /health/check` endpoint returning a 200 response, indicating the service is operational.

## Exception Handling

An exception filter is provided to standardize error responses. It captures exceptions and formats responses with details such as `statusCode`, `errorCode`, and `message`. 
The `ExceptionHandler` also logs errors to the console and, for status codes `>= 400`, sends them to Sentry.

## Data Validation

The module automatically integrates a `ValidationPipe` to validate DTOs. Any errors identified trigger a `ValidationException` detailing the problematic fields.

### Handling Arrays in Request Bodies

NestJS does not automatically generate validations or Swagger definitions for array bodies. 
Use `@ApiBody()` and `CustomArrayValidationPipe` as demonstrated:

```
@Post('release-and-reserve')
@ApiBody({ type: [ReleaseAndReserveBudgetDto] })
public releaseAndReserve(
  @Body(new CustomArrayValidationPipe({ items: ReleaseAndReserveBudgetDto }))
  body: ReleaseAndReserveBudgetDto[],
): Promise<BudgetReservationDto[]> {
  return this.budgetService.releaseAndReserveBudget(body);
}

```

## Request Context Service

Includes `RequestContextService`, which provides data related to the current request, such as `requestId`, `ip`, `method`, `body`, and `url`.

## Custom Logger

A custom logger that automatically includes request-related data can be passed to the customInstance property if using `@packages/common` for application bootstrap.

## DTO decorators

### Handling Query Arrays

For scenarios where query arrays may not parse correctly (e.g., during Cypress testing), use `@TransformQueryArray`:

```
export class GetFilesByIdsDto {
  @IsNumber(undefined, { each: true })
  @IsArray()
  @TransformQueryArray(Number)
  ids: number[];
}
```

Notice, that we use `Number` to convert all values to number, because bu default all values from query parameters it's strings

### Enum Decorations in DTOs

To ensure integer enums are handled correctly in Swagger and by the server, employ a custom decorator:


```
@IsEnum(CampaignConnectionType, { each: true })
@ApiEnumProperty({
  enum: CampaignConnectionType,
  enumType: 'string',
  isArray: true,
  transform: 'string'
})
connectionTypes: CampaignConnectionType[];
```

## Swagger CLI Plugin for NestJS

Enhance your NestJS project with automatic DTO decorator generation for Swagger documentation. 
To use our custom Swagger plugin outside of the Nest CLI, include the `swagger-plugin.ts` file from `@packages/http-server` in your `tsconfig.json` using the `ts-path` configuration.

```json
{
  "compilerOptions": {
    "plugins": [
      { "transform": "@packages/http-server/swagger-plugin.ts" }
    ]
  }
}

```

This setup allows the plugin to automatically generate the necessary Swagger decorators for your DTOs, streamlining the documentation process.

