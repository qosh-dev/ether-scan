/**
 * A type that expands an object type by making its properties more specific.
 * @template T - The type of the object to expand.
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;
