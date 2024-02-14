export type RequestBalancerMethodArgument<T, M> = M extends keyof T
  ? Parameters<T[M] extends (...args: any) => any ? T[M] : never>[0]
  : never;

export type RequestBalancerMethodReturn<M extends keyof T, T> = Awaited<
  ReturnType<T[M] extends (...args: any) => any ? T[M] : never>
>;
