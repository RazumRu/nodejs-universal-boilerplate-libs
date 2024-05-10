import { Logger } from './logger.js';
import 'jest-extended';

describe(Logger, () => {
  const logger = new Logger({
    environment: 'test',
    appName: 'test',
    appVersion: '1',
  });

  const expectedPayload = {
    environment: 'test',
    appName: 'test',
    appVersion: '1',
    instanceIp: expect.toBeString(),
  };

  describe(logger.debug, () => {
    const pinoSpy = jest.spyOn(logger.pino, 'debug');

    it('should call debug', () => {
      logger.debug('message', {
        foo: 'bar',
      });

      expect(pinoSpy).toHaveBeenCalledTimes(1);
      expect(pinoSpy).toHaveBeenCalledWith({
        ...expectedPayload,
        msg: 'message',
        level: 'debug',
        data: {
          foo: 'bar',
        },
      });
    });
  });

  describe(logger.log, () => {
    const pinoSpy = jest.spyOn(logger.pino, 'info');

    it('should call log', () => {
      logger.log('message', {
        foo: 'bar',
      });

      expect(pinoSpy).toHaveBeenCalledTimes(1);
      expect(pinoSpy).toHaveBeenCalledWith({
        ...expectedPayload,
        msg: 'message',
        level: 'info',
        data: {
          foo: 'bar',
        },
      });
    });
  });

  describe(logger.verbose, () => {
    const pinoSpy = jest.spyOn(logger.pino, 'trace');

    it('should call trace', () => {
      logger.trace('message', {
        foo: 'bar',
      });

      expect(pinoSpy).toHaveBeenCalledTimes(1);
      expect(pinoSpy).toHaveBeenCalledWith({
        ...expectedPayload,
        msg: 'message',
        level: 'trace',
        data: {
          foo: 'bar',
        },
      });
    });
  });

  describe(logger.warn, () => {
    const pinoSpy = jest.spyOn(logger.pino, 'warn');

    it('should call warn', () => {
      logger.warn('message', {
        foo: 'bar',
      });

      expect(pinoSpy).toHaveBeenCalledTimes(1);
      expect(pinoSpy).toHaveBeenCalledWith({
        ...expectedPayload,
        msg: 'message',
        level: 'warn',
        data: {
          foo: 'bar',
        },
      });
    });
  });

  describe(logger.error, () => {
    const pinoSpy = jest.spyOn(logger.pino, 'error');

    beforeEach(() => {
      pinoSpy.mockClear();
    });

    it('should call exceptions with text', () => {
      logger.error('message', undefined, {
        foo: 'bar',
      });

      expect(pinoSpy).toHaveBeenCalledTimes(1);
      expect(pinoSpy).toHaveBeenCalledWith({
        ...expectedPayload,
        msg: 'message',
        level: 'error',
        data: {
          foo: 'bar',
        },
      });
    });

    it('should call exceptions with Error', () => {
      const error = new Error('message');
      logger.error(error, undefined, {
        foo: 'bar',
      });

      expect(pinoSpy).toHaveBeenCalledTimes(1);
      expect(pinoSpy).toHaveBeenCalledWith({
        ...expectedPayload,
        msg: 'message',
        error: {
          ...error,
          stack: error.stack,
        },
        level: 'error',
        data: {
          foo: 'bar',
        },
      });
    });
  });
});
