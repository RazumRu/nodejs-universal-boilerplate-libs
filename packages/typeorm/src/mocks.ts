import { AuditEntity } from './entity/audit.entity';

export const getRepositoryMock = (): any => {
  const instance: any = {
    createQueryBuilder: jest.fn(() => instance),
    insert: jest.fn(() => instance),
    values: jest.fn(() => instance),
    returning: jest.fn(() => instance),
    execute: jest.fn(() => instance),
    where: jest.fn(() => instance),
    orWhere: jest.fn(() => instance),
    update: jest.fn(() => instance),
    limit: jest.fn(() => instance),
    offset: jest.fn(() => instance),
    andWhere: jest.fn(() => instance),
    set: jest.fn(() => instance),
    from: jest.fn(() => instance),
    getCount: jest.fn(() => instance),
    getMany: jest.fn(() => instance),
    orderBy: jest.fn(() => instance),
    delete: jest.fn(() => instance),
    softDelete: jest.fn(() => instance),
    groupBy: jest.fn(() => instance),
    addGroupBy: jest.fn(() => instance),
    select: jest.fn(() => instance),
    addSelect: jest.fn(() => instance),
    innerJoin: jest.fn(() => instance),
    leftJoin: jest.fn(() => instance),
    distinct: jest.fn(() => instance),
    setParameter: jest.fn(() => instance),
    setParameters: jest.fn(() => instance),
    orUpdate: jest.fn(() => instance),
    withDeleted: jest.fn(() => instance),
    restore: jest.fn(() => instance),
    findOne: jest.fn(),
    getOne: jest.fn(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
    find: jest.fn(),
  };

  return instance;
};

export const buildAuditEntityMockFields = (): AuditEntity => ({
  createdBy: 'createdBy',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});
