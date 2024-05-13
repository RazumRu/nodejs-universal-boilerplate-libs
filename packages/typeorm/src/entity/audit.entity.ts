import { Column, Index } from 'typeorm';
import { TimestampsEntity } from './timestamps.entity';

export class AuditEntity extends TimestampsEntity {
  @Index()
  @Column({
    type: 'uuid',
    nullable: true,
  })
  createdBy: string | null;
}
