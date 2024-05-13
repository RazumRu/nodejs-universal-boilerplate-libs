import { Module } from '@nestjs/common';
import { HealthCheckerController } from './controllers/health-checker.controller';

@Module({
  controllers: [HealthCheckerController],
  providers: [],
  exports: [],
})
export class HealthCheckerModule {}
