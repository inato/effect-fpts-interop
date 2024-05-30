import type { AnyEffectFunction, EffectFunction } from "./EffectFunction";
import type {
  AnyFptsConvertible,
  FptsConvertible,
  FptsIdOf,
} from "../FptsConvertible";
import type { ReaderTaskEither } from "../ReaderTaskEither";

export type PortToFpts<P, M> = {
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
