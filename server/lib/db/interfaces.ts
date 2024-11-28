type Pagination<TId extends string | number = string> = {
  cursor: TId | undefined;
  count: number;
};

interface Writeable {
  create(value: unknown): Promise<unknown>;
}

interface Updateable {
  update(id: unknown, value: unknown): Promise<unknown>;
}

interface Deletable {
  delete(id: unknown): Promise<unknown>;
}

interface ReadOne {
  findById(id: string): Promise<unknown>;
}

interface ReadMany {
  findMany(...args: unknown[]): Promise<unknown>;
}

interface Readable extends ReadOne, ReadMany {}

interface HasParent {
  getParent(): Promise<Record<string, unknown>>;
  setParentId(...args: unknown[]): void;
  findManyByParentId(parentId: string): Promise<unknown>;
}

interface Upsertable {
  upsert(value: unknown, ...args: unknown[]): Promise<unknown>;
}

interface Orderable {
  setOrderable(...args: unknown[]): Promise<unknown>;
}

export type {
  Writeable,
  Deletable,
  ReadMany,
  ReadOne,
  Readable,
  Updateable,
  HasParent,
  Pagination,
  Upsertable,
  Orderable,
};
