import { isNumber, isString } from 'lodash';
import { IsEnum } from 'class-validator';
import { TransformEnum } from './transformers';
import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export type ApiPropertyEnumOptions<T extends { [key: string]: any }> = {
  /**
   * Indicates if multiple enum values can be used as the same time (thus being an array).
   * Defaults to `false`.
   */
  isArray?: boolean;

  /**
   * The enum that should be represented.
   */
  enum: T;

  /**
   * The type of the enum values. Defaults to `'number'`.
   */
  enumType?: 'string' | 'number';

  description?: string;

  transform?: 'string' | 'number';
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ApiEnumProperty = <T extends { [key: string]: any }>(
  options: ApiPropertyEnumOptions<T>,
): PropertyDecorator => {
  const {
    enum: enumRef,
    isArray = false,
    enumType = 'number',
    transform = false,
  } = options;

  const enumStringValues = Object.values(enumRef).filter(isString);
  const enumNumberValues = Object.values(enumRef).filter(isNumber);
  const exampleValue =
    enumType === 'string' ? enumStringValues[0] : enumNumberValues[0];

  const description =
    (options.description ? `${options.description}:` : '') +
    Object.values(enumRef)
      .filter(isString)
      .map((name) => `${name} = ${enumRef[name]}`)
      .join('; ');

  const decorators = [
    IsEnum(enumRef, { each: isArray }),
    ApiProperty({
      enum: enumType === 'string' ? enumStringValues : enumNumberValues,
      isArray,
      type: enumType,
      example: isArray ? [exampleValue] : exampleValue,
      description,
    }),
  ];

  if (transform) {
    decorators.push(
      TransformEnum({
        enum: enumRef,
        isArray,
        type: transform,
      }),
    );
  }

  return applyDecorators(...decorators);
};
