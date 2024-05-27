import type { Context } from "effect";
import type { UnionToIntersection } from "effect/Types";
import type { ReaderTaskEither } from "fp-ts/ReaderTaskEither";
import type { FptsFunction } from "./FptsFunction";
import type { AnyFptsConvertible } from "./FptsConvertible";

type EmptyIfUnknown<T> = unknown extends T ? {} : T;

type FptsFunctionEnv<T> = EmptyIfUnknown<
  T extends FptsFunction<any, infer Env, any, any> ? Env : unknown
>;

type ExtractFptsEnvAccess<T> = UnionToIntersection<
  { [k in keyof T]: FptsFunctionEnv<T[k]> }[keyof T]
>;

type InferFptsMappingImpl<T> = Exclude<
  T[keyof T],
  AnyFptsConvertible
> extends never
  ? { [k in keyof T]: Context.Tag<any, T[k]> }
  : {
      error: `ERROR all ports should derive from FptsConvertible`;
      ports: Exclude<T[keyof T], AnyFptsConvertible>;
    };

export type InferFptsMapping<T> = InferFptsMappingImpl<ExtractFptsEnvAccess<T>>;
