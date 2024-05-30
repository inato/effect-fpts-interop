import { Context, Effect } from "effect";
import type { AnyFptsFunction, FptsFunction } from "./FptsFunction";

export type PortToEffect<P, M> = {
  [k in keyof P as P[k] extends AnyFptsFunction
    ? k
    : never]: P[k] extends FptsFunction<
    infer Args,
    infer Env,
    infer Err,
    infer A
  >
    ? (...args: Args) => Effect.Effect<
        A,
        Err,
        Context.Tag.Service<
          //@ts-expect-error "Type 'keyof Env' cannot be used to index type 'Mapping'"
          M[keyof Env]
        >
      >
    : never;
};
