import { Context, Effect } from "effect";
import type {
  AnyEffectFunction,
  EffectFunction,
} from "./internal/EffectFunction";
import type {
  AnyFptsConvertible,
  FptsConvertible,
  FptsIdOf,
} from "./FptsConvertible";
import type { FptsFunction } from "./internal/FptsFunction";
import type {
  InferFptsMappingFromEffectFunction,
  InferFptsMappingFromEffectPort,
} from "./internal/InferFptsMapping";
import type { ReaderTaskEither } from "fp-ts/ReaderTaskEither";

type PortToFpts<P, M> = {
  [k in keyof P as P[k] extends AnyEffectFunction
    ? k
    : never]: P[k] extends EffectFunction<
    infer Args,
    infer Env extends AnyFptsConvertible,
    infer Err,
    infer A
  >
    ? (...args: Args) => ReaderTaskEither<
        {
          [k in FptsIdOf<Env>]: Extract<Env, FptsConvertible<k>>;
        },
        Err,
        A
      >
    : never;
};

export const portToFpts: <P, M extends InferFptsMappingFromEffectPort<P>>(
  port: P,
  mapping: M
) => PortToFpts<P, M> = (port, mapping) =>
  new Proxy({} as any, {
    get(_target, k) {
      return ((...args: any[]) =>
        (access: any) => {
          const effect =
            //@ts-expect-error
            port[k](...args);
          let ctx = Context.empty();
          for (const m in mapping) {
            if (access[m] !== undefined) {
              ctx = Context.add(
                //@ts-expect-error
                mapping[m],
                access[m]
              )(ctx);
            }
          }
          return () =>
            effect.pipe(
              Effect.provide(ctx as Context.Context<any>),
              Effect.either,
              Effect.runPromise
            );
        }) as any;
    },
  });
