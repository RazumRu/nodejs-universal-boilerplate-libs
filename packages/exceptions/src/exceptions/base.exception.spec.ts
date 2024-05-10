import { BaseException } from './base.exception.js';

describe('BaseException', () => {
  describe('getFullMessage', () => {
    it('should return correct message', () => {
      const err = new BaseException('ERR_CODE', 500, {
        description: 'Error description',
      });

      const msg = err.getFullMessage();

      expect(msg).toEqual('[ERR_CODE] Error description');
    });
  });
});
