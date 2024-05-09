# @packages/logger

This is a robust logging library based on `pino`, designed to provide a standardized logging format and easy integration with Sentry. 
It includes a custom module for NestJs.

## How to use custom logger

Here’s how to set up and use the custom logger in your project:

```typescript
@Injectable({
  scope: Scope.REQUEST,
})
export class CustomLogger extends BaseLogger {
  constructor(private readonly logger: RequestContextLogger) {
    super(logger.params);
  }

  public getCustomPayload() {
    return {
      ...this.logger.getCustomPayload(),
      test: 11,
    };
  }
}

// including Logger module

LoggerModule.forRoot({
  customInstance: CustomLogger
})

// Injecting the logger, with options based on use-case:
// For custom scoped logger OR default (if you didn't use custom):
@Inject(LOGGER)
private readonly logger: CustomLogger

// For default unscoped logger:
private readonly logger: Logger

// Optionally, explicitly declare a custom logger:
private readonly logger: CustomLogger
```
