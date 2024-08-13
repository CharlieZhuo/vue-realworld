export interface Store<T> {
  get(): T | null;
  set(value: T): void;
  remove(): void;
}
