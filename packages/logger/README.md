# @packages/logger

This library leverages `pino` to deliver a standardized logging format, integrated seamlessly with Sentry, and includes a custom module for NestJS.
If you are using `@packages/common`, this logging library is automatically included, simplifying integration.

## Setting Up the Custom Logger (optional)

Follow these steps to integrate the custom logger into your NestJS project:


### Step 1: Define the Custom Logger

Create a custom logger by extending BaseLogger and using Logger to get parameters


```typescript
@Injectable()
export class CustomLogger extends BaseLogger {
  constructor(private readonly logger: Logger) {
    super(logger.loggerParams);
  }

  public getCustomPayload() {
    return {
      ...this.logger.getCustomPayload(),
      test: 11,  // Example additional payload
    };
  }
}

```

### Step 2: Pass custom logger to parameters

```typescript
LoggerModule.forRoot({
  customInstance: CustomLogger
})
```

or 

```typescript
import { bootstrap } from '@packages/common';
import { AppModule } from './app.module';
import { environment } from './environments';

bootstrap([AppModule], {
  logger: {
    customInstance: CustomLogger
  },
});

```

### Step 3: Inject the Logger

Inject the appropriate logger into your services based on your specific requirements:

#### General Injection

Use this injection method to utilize either the default logger or a custom logger if configured:

```typescript
@Inject(LOGGER)
private readonly logger: BaseLogger
```

#### Default Logger Injection

For cases where only the default logger functionality is needed:

```typescript
private readonly logger: Logger
```

#### Custom Logger Injection

When you need to explicitly utilize the features of the custom logger:


```typescript
private readonly logger: CustomLogger
```


## Sentry Service Integration

You can enhance error reporting by utilizing the provided Sentry service. This service is automatically injected, and you can use it if you specify the `sentryDsn` parameter.

### Usage Example

Here's how to integrate the Sentry service into your exception handling:


```typescript
@Injectable()
export class ExceptionHandler {
  constructor(private readonly sentryService: SentryService) {}

  public handle(exception: any, message?: string): void {
    const data = this.getSentryExceptionData(exception);
    this.sentryService.send(exception, data);
  }

  private getSentryExceptionData(exception: any): ISentryExceptionData {
    // Logic to format exception data for Sentry
    return {
      // Implementation details
    };
  }
}
```
