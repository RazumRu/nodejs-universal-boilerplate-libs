import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormService {
  constructor(private readonly connection: DataSource) {}

  public trx<T = any>(
    cb: (entityManager: EntityManager) => Promise<T>,
    entityManager?: EntityManager,
  ): Promise<T> {
    return entityManager ? cb(entityManager) : this.connection.transaction(cb);
  }
}
