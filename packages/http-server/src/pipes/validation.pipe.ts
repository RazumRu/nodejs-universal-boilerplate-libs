import {
  ValidationError,
  ValidationPipe as NestValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import {
  EXCEPTION_CODES,
  IExceptionFieldError,
  ValidationException,
} from '@packages/exceptions';

export class ValidationPipe extends NestValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      skipMissingProperties: false,
      skipUndefinedProperties: false,
      skipNullProperties: false,
      whitelist: true,
      //transformerPackage: Transformer,
      exceptionFactory: (...args) =>
        ValidationPipe.getExceptionFactory(...args),
      ...(options || {}),
    });
  }

  public static getExceptionFactory(errors: ValidationError[]) {
    const findConstraints = (
      errors: ValidationError[],
      path: string,
      constraints: IExceptionFieldError[] = [],
    ) => {
      for (const err of errors) {
        if (err.constraints) {
          constraints.push(
            ...Object.entries(err.constraints).map((e) => ({
              message: e[1],
              index: e[0],
              name: err.property,
              path: `${path}.${err.property}`.replace(/^\./, ''),
              value: String(err.value),
            })),
          );
        }

        if (err.children) {
          findConstraints(err.children, `${path}.${err.property}`, constraints);
        }
      }

      return constraints;
    };

    return new ValidationException(
      EXCEPTION_CODES.VALIDATION_ERROR,
      undefined,
      findConstraints(errors, ''),
    );
  }
}
