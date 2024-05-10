import { EXCEPTION_CODES } from './exceptions.codes.js';
import { BadRequestException } from './exceptions/bad-request.exception.js';
import { BaseException } from './exceptions/base.exception.js';
import { ForbiddenException } from './exceptions/forbidden.exception.js';
import { InternalException } from './exceptions/internal.exception.js';
import { NotFoundException } from './exceptions/not-found.exception.js';
import { UnauthorizedException } from './exceptions/unauthorized.exception.js';
import { ValidationException } from './exceptions/validation.exception.js';

export * from './exceptions.types.js';
export * from './exceptions.codes.js';

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
