import { EXCEPTION_CODES } from './exceptions.codes';
import { BadRequestException } from './exceptions/bad-request.exception';
import { BaseException } from './exceptions/base.exception';
import { ForbiddenException } from './exceptions/forbidden.exception';
import { InternalException } from './exceptions/internal.exception';
import { NotFoundException } from './exceptions/not-found.exception';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { ValidationException } from './exceptions/validation.exception';

export * from './exceptions.types';
export * from './exceptions.codes';

export {
  BaseException,
  BadRequestException,
  ForbiddenException,
  InternalException,
  ValidationException,
  UnauthorizedException,
  NotFoundException,
};

/**
 * Add new exception codes
 * @param data
 */
export const addExceptionCode = (data: { [key: string]: string }) => {
  for (const i in data) {
    EXCEPTION_CODES[i] = data[i];
  }
};
