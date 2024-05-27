import { Context, Effect } from "effect";
import type { AnyEffectFunction, EffectFunction } from "./EffectFunction";
import type {
  AnyFptsConvertible,
  FptsConvertible,
  FptsIdOf,
} from "./FptsConvertible";
import type { FptsFunction } from "./FptsFunction";
import type { InferFptsMappingFromEffectFunction } from "./InferFptsMapping";

type EffectToFpts<F, M> = F extends EffectFunction<
  infer Args,
  infer Env extends AnyFptsConvertible,
  infer Err,
  infer A
>
  ? FptsFunction<
      Args,
      {
        [k in FptsIdOf<Env>]: Extract<Env, FptsConvertible<k>>;
      },
      Err,
      A
    >
  : never;

export const effectToFpts: <
  F extends AnyEffectFunction,
  M extends InferFptsMappingFromEffectFunction<F>
>(
  fun: F,
  mapping: M
) => EffectToFpts<F, M> = (fun, mapping) =>
  ((...args: any[]) =>
    (access: any) => {
      const effect = fun(...args);
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
