import { HealthCheckerController } from './health-checker.controller';
import { HealthStatus } from '../http-server.types';
import { Test, TestingModule } from '@nestjs/testing';

describe(HealthCheckerController, () => {
  let controller: HealthCheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
      controllers: [HealthCheckerController],
    }).compile();

    controller = module.get<HealthCheckerController>(HealthCheckerController);
  });

  describe('check', () => {
    it('should return status OK', async () => {
      const resp = await controller.check();
      expect(resp).toMatchObject({
        status: HealthStatus.Ok,
      });
    });
  });
});
