import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  DataSource,
  DeleteQueryBuilder,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';
import { removeKeysPrefix } from './utils';

export type AdditionalParams = Partial<{
  offset: number;
  limit: number;
  orderBy: string | null;
  sortOrder: 'DESC' | 'ASC';
  projection: string[];
  withDeleted: boolean;
}>;

export type EntityAttributes<T extends ObjectLiteral> = Omit<
  T,
  'createdAt' | 'updatedAt' | 'id' | 'deletedAt'
>;

export type BaseQueryBuilder<T extends ObjectLiteral> =
  | SelectQueryBuilder<T>
  | UpdateQueryBuilder<T>
  | DeleteQueryBuilder<T>;

export abstract class BaseDao<
  T extends ObjectLiteral,
  U extends ObjectLiteral,
  K = number,
> {
  protected abstract get alias(): string;

  protected abstract get entity(): EntityTarget<T>;

  protected constructor(private dataSource: DataSource) {}

  protected get repository(): Repository<T> {
    return this.dataSource.getRepository(this.entity);
  }

  protected getQueryBuilder(entityManager?: EntityManager, alias?: string) {
    return (
      entityManager
        ?.getRepository(this.entity)
        .createQueryBuilder(alias || this.alias) ||
      this.repository.createQueryBuilder(alias || this.alias)
    );
  }

  /**
   * Parameters that will apply to Delete/Update/Get queries
   * @param builder
   * @param params
   * @protected
   */
  protected applySearchParams?(builder: BaseQueryBuilder<T>, params?: U): void;

  /**
   * Parameters that will add to get queries
   * @param builder
   * @param params
   * @protected
   */
  protected applyMutationParams?(
    builder: SelectQueryBuilder<T>,
    params?: U,
  ): void;

  protected applyAdditionalParams(
    builder: SelectQueryBuilder<T>,
    params?: AdditionalParams,
  ) {
    if (params?.sortOrder !== null) {
      builder.orderBy(
        `${this.alias}."${params?.orderBy || 'createdAt'}"`,
        params?.sortOrder || 'DESC',
      );
    }

    if (params?.limit) {
      builder.limit(params.limit);
    }

    if (params?.offset) {
      builder.offset(params.offset);
    }

    if (params?.projection) {
      builder.select(params.projection);
    }

    if (params?.withDeleted) {
      builder.withDeleted();
    }
  }

  public async create(
    data: EntityAttributes<T>,
    entityManager?: EntityManager,
  ): Promise<T> {
    return (
      await this.getQueryBuilder(entityManager)
        .insert()
        .values(<QueryDeepPartialEntity<ObjectLiteral>>data)
        .returning('*')
        .execute()
    ).generatedMaps[0] as T;
  }

  public async createMany(
    data: EntityAttributes<T>[],
    entityManager?: EntityManager,
  ): Promise<T[]> {
    return (
      await this.getQueryBuilder(entityManager)
        .insert()
        .values(<QueryDeepPartialEntity<ObjectLiteral>>data)
        .returning('*')
        .execute()
    ).generatedMaps as T[];
  }

  public async updateMany(
    params: U,
    data: Partial<EntityAttributes<T>>,
    entityManager?: EntityManager,
  ): Promise<T | null> {
    const builder = this.getQueryBuilder(entityManager).update();

    if (this.applySearchParams) {
      this.applySearchParams(builder, <U>params);
    }

    const result = await builder
      .set(<QueryDeepPartialEntity<ObjectLiteral>>data)
      .returning('*')
      .execute();

    return (result.raw[0] as T) || null;
  }

  public async updateById(
    id: K,
    data: Partial<EntityAttributes<T>>,
    entityManager?: EntityManager,
  ): Promise<T | null>;
  public async updateById(
    id: K,
    data: Partial<EntityAttributes<T>>,
    params?: U,
    entityManager?: EntityManager,
  ): Promise<T | null>;
  public async updateById(
    id: K,
    data: Partial<EntityAttributes<T>>,
    params?: U | EntityManager,
    entityManager?: EntityManager,
  ): Promise<T | null> {
    if (params && params instanceof EntityManager) {
      entityManager = params;
      params = undefined;
    }

    const builder = this.getQueryBuilder(entityManager).update();

    if (this.applySearchParams) {
      this.applySearchParams(builder, <U>params);
    }

    builder.andWhere({ id });

    const result = await builder
      .set(<QueryDeepPartialEntity<ObjectLiteral>>data)
      .returning('*')
      .execute();

    return (result.raw[0] as T) || null;
  }

  public async getById(id: K, entityManager?: EntityManager): Promise<T | null>;
  public async getById(
    id: K,
    params: U & AdditionalParams,
    entityManager?: EntityManager,
  ): Promise<T | null>;
  public async getById(
    id: K,
    params?: (U & AdditionalParams) | EntityManager,
    entityManager?: EntityManager,
  ): Promise<T | null> {
    if (!entityManager) {
      entityManager = <EntityManager>params;
      params = undefined;
    }

    const builder = this.getQueryBuilder(entityManager);

    builder.where({ id });

    this.applyAdditionalParams(builder, <U & AdditionalParams>params);
    if (this.applySearchParams) {
      this.applySearchParams(builder, <U & AdditionalParams>params);
    }

    if (this.applyMutationParams) {
      this.applyMutationParams(builder, <U & AdditionalParams>params);
    }

    const res = await builder.getRawOne();
    return res ? removeKeysPrefix(this.alias, res) : null;
  }

  public async count(
    params?: U,
    entityManager?: EntityManager,
  ): Promise<number> {
    const builder = this.getQueryBuilder(entityManager);

    if (this.applySearchParams) {
      this.applySearchParams(builder, params);
    }

    if (this.applyMutationParams) {
      this.applyMutationParams(builder, params);
    }

    return builder.getCount();
  }

  public async getAll(
    params?: U & AdditionalParams,
    entityManager?: EntityManager,
  ): Promise<T[]> {
    const builder = this.getQueryBuilder(entityManager);

    this.applyAdditionalParams(builder, params);
    if (this.applySearchParams) {
      this.applySearchParams(builder, params);
    }

    if (this.applyMutationParams) {
      this.applyMutationParams(builder, params);
    }

    const res = await builder.getRawMany();

    return res?.map((el) => removeKeysPrefix(this.alias, el)) || [];
  }

  public async getOne(
    params?: U & AdditionalParams,
    entityManager?: EntityManager,
  ): Promise<T | null> {
    const builder = this.getQueryBuilder(entityManager);

    this.applyAdditionalParams(builder, params);
    if (this.applySearchParams) {
      this.applySearchParams(builder, params);
    }

    if (this.applyMutationParams) {
      this.applyMutationParams(builder, params);
    }

    const res = await builder.getRawOne();

    return res ? removeKeysPrefix(this.alias, res) : null;
  }

  public async deleteById(id: K, entityManager?: EntityManager): Promise<void>;
  public async deleteById(
    id: K,
    params: U,
    entityManager?: EntityManager,
  ): Promise<void>;
  public async deleteById(
    id: K,
    params?: U | EntityManager,
    entityManager?: EntityManager,
  ): Promise<void> {
    if (!entityManager) {
      entityManager = <EntityManager>params;
      params = undefined;
    }

    const builder = this.getQueryBuilder(entityManager)
      .softDelete()
      .where({ id });

    if (this.applySearchParams) {
      this.applySearchParams(
        <DeleteQueryBuilder<T>>(<unknown>builder),
        <U>params,
      );
    }

    await builder.execute();
  }

  public async restoreById(id: K, entityManager?: EntityManager): Promise<void>;
  public async restoreById(
    id: K,
    params: U,
    entityManager?: EntityManager,
  ): Promise<void>;
  public async restoreById(
    id: K,
    params?: U | EntityManager,
    entityManager?: EntityManager,
  ): Promise<void> {
    if (!entityManager) {
      entityManager = <EntityManager>params;
      params = undefined;
    }

    const builder = this.getQueryBuilder(entityManager)
      .softDelete()
      .where({ id });

    if (this.applySearchParams) {
      this.applySearchParams(
        <DeleteQueryBuilder<T>>(<unknown>builder),
        <U>params,
      );
    }

    await builder.restore().execute();
  }

  public async hardDeleteById(
    id: K,
    entityManager?: EntityManager,
  ): Promise<void>;
  public async hardDeleteById(
    id: K,
    params: U,
    entityManager?: EntityManager,
  ): Promise<void>;
  public async hardDeleteById(
    id: K,
    params?: U | EntityManager,
    entityManager?: EntityManager,
  ): Promise<void> {
    if (!entityManager) {
      entityManager = <EntityManager>params;
      params = undefined;
    }

    const builder = this.getQueryBuilder(entityManager).delete().where({ id });

    if (this.applySearchParams) {
      this.applySearchParams(builder, <U>params);
    }

    await builder.execute();
  }
}
