import { BadRequestException } from './bad-request.exception';

describe('BadRequestException', () => {
  describe('name', () => {
    it('should return correct name', () => {
      const exception = new BadRequestException();

      expect(exception.name).toEqual('BadRequestException');
    });
  });
});
