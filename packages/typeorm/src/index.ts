import { DataSource, EntitySchema } from 'typeorm';
import { TypeormModule } from './typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';

export * from './utils';
export * from './mocks';
export * from './entity/audit.entity';
export * from './entity/timestamps.entity';
export * from './typeorm.service';
export * from 'typeorm';
export * from './base.dao';

export { TypeormModule, DataSource };

export const registerEntities = (entities?: (any | EntitySchema)[]) =>
  TypeOrmModule.forFeature(entities);
