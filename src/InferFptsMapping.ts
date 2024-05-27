import type { Context } from "effect";
import type { UnionToIntersection } from "effect/Types";
import type { ReaderTaskEither } from "fp-ts/ReaderTaskEither";
import type { FptsFunction } from "./FptsFunction";

type EmptyIfUnknown<T> = unknown extends T ? {} : T;

type FptsFunctionEnv<T> = EmptyIfUnknown<
  T extends FptsFunction<any, infer Env, any, any> ? Env : unknown
>;

type ExtractFptsEnv<T> = UnionToIntersection<
  { [k in keyof T]: FptsFunctionEnv<T[k]> }[keyof T]
>;

type InferFptsMappingImpl<T> = { [k in keyof T]: Context.Tag<any, T[k]> };

export type InferFptsMapping<T> = InferFptsMappingImpl<ExtractFptsEnv<T>>;
