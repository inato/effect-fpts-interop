import type { Effect } from "effect";

export type EffectFunction<Args extends any[], Env, Err, A> = (
  ...args: Args
) => Effect.Effect<A, Err, Env>;

export type AnyEffectFunction = EffectFunction<any, any, any, any>;
