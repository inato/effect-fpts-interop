import type { ReaderTaskEither } from "fp-ts/ReaderTaskEither";

export type FptsFunction<Args extends any[], Env, Err, A> = (
  ...args: Args
) => ReaderTaskEither<Env, Err, A>;

export type AnyFptsFunction = FptsFunction<any, any, any, any>;
