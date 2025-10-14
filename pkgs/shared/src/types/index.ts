export * from "./ro";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type OptionalProperty<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
