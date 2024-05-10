import { get } from 'lodash-es';
import { IExceptionData, IExceptionFieldError } from '../exceptions.types.js';
import { EXCEPTION_CODES } from '../exceptions.codes.js';

export class BaseException extends Error {
  constructor(
    public errorCode: string,
    public statusCode: number,
    public data: {
      description?: string;
      fields?: IExceptionFieldError[];
      customData?: Record<string, any>;
    },
  ) {
    super();
    this.message = this.getMessage() || '';
  }

  public get code() {
    return this.errorCode;
  }

  public getMessage() {
    return (
      this.data.description ||
      get(EXCEPTION_CODES, this.code, 'An exceptions has occurred')
    );
  }

  public getFullMessage() {
    let msg = this.getMessage();

    if (this.data.fields) {
      msg = `${msg}: ${this.data.fields
        .map((f) => `${f.name} - ${f.message}`)
        .join(', ')}`;
    }

    msg = `[${this.code}] ${msg}`;

    return msg;
  }

  public static getExceptionData(
    exception: (BaseException | Error) & Partial<{ status: number }>,
  ): IExceptionData {
    return {
      name: exception.name,
      statusCode:
        (<BaseException>exception).statusCode || exception.status || 500,
      code: (<BaseException>exception).code || 'INTERNAL_SERVER_ERROR',
      message: (<BaseException>exception).getMessage
        ? (<BaseException>exception).getMessage()
        : exception.message,
      fullMessage: (<BaseException>exception).getFullMessage
        ? (<BaseException>exception).getFullMessage()
        : exception.message,
      fields: (<BaseException>exception).data?.fields || [],
      customData: (<BaseException>exception).data?.customData,
    };
  }
}
