import { BadRequestException } from './bad-request.exception.js';

describe('BadRequestException', () => {
  describe('name', () => {
    it('should return correct name', () => {
      const exception = new BadRequestException();

      expect(exception.name).toEqual('BadRequestException');
    });
  });
});
