type CollectionGetOptions = { strict?: boolean };

declare interface Collection<V> extends Omit<Map<string, V>, 'forEach' | 'delete' | 'set' | SymbolConstructor['iterator']> {
  set(key: string, value: V): this;

  delete(key: string): boolean;

  [Symbol.iterator](): IterableIterator<V>;

  get contents(): V[];

  find<T extends V = V>(condition: (value: V) => boolean): T | undefined;

  filter<T extends V = V>(condition: (value: V) => value is T): T[];
  filter<T extends V = V>(condition: (value: V) => boolean): T[];

  forEach(fn: (value: V) => void): void;

  get<T extends V = V>(key: Maybe<string>, { strict }: { strict: true }): T;
  get<T extends V = V>(key: string, { strict }?: CollectionGetOptions): T | undefined;

  getName(name: string, { strict }?: { strict?: boolean }): V | undefined;

  map<T>(transformer: (value: V, index: number, collection: this) => T): T[];

  reduce<T>(evaluator: (accumulator: T, value: V) => T, initial: T): T;

  some(condition: (value: V) => boolean): boolean;
}
