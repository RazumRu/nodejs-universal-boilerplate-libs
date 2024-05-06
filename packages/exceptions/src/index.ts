import { EXCEPTION_CODES } from './exceptions.codes';
import { BaseException } from './exceptions/base.exception';

export * from './exceptions.types';
export * from './exceptions.codes';

export { BaseException };

/**
 * Add new exception codes
 * @param data
 */
export const addExceptionCode = (data: { [key: string]: string }) => {
  for (const i in data) {
    EXCEPTION_CODES[i] = data[i];
  }
};
