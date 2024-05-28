import type { Context } from "effect";
import type { UnionToIntersection } from "effect/Types";
import type { ReaderTaskEither } from "fp-ts/ReaderTaskEither";
import type { FptsFunction } from "./FptsFunction";
import type {
  AnyFptsConvertible,
  FptsConvertible,
  FptsIdOf,
} from "../FptsConvertible";
import type { EffectFunction } from "./EffectFunction";

export type ContextTagMapping<T> = T extends AnyFptsConvertible
  ? {
      [k in FptsIdOf<T>]: Context.Tag<any, Extract<T, FptsConvertible<k>>>;
    }
  : never;

type InferFptsMapping<T> = Exclude<T, AnyFptsConvertible> extends never
  ? ContextTagMapping<T>
  : {
      error: `ERROR all ports should derive from FptsConvertible`;
      ports: Exclude<T, AnyFptsConvertible>;
    };

type EmptyIfUnknown<T> = unknown extends T ? {} : T;

type FptsFunctionEnv<T> = EmptyIfUnknown<
  T extends FptsFunction<any, infer Env, any, any> ? Env : unknown
>;

type FptsPortEnv<T> = UnionToIntersection<
  { [k in keyof T]: FptsFunctionEnv<T[k]> }[keyof T]
>;

type InferFptsMappingFromFptsPortImpl<T> = InferFptsMapping<T[keyof T]>;

export type InferFptsMappingFromFptsPort<T> = InferFptsMappingFromFptsPortImpl<
  FptsPortEnv<T>
>;

type EffectFunctionEnv<T> = EmptyIfUnknown<
  T extends EffectFunction<any, infer Env, any, any> ? Env : unknown
>;

type InferFptsMappingFromEffectFunctionImpl<T> = T;

export type InferFptsMappingFromEffectFunction<T> = InferFptsMapping<
  EffectFunctionEnv<T>
>;

type EffectPortEnv<T> = {
  [k in keyof T]: EffectFunctionEnv<T[k]>;
}[keyof T];

export type InferFptsMappingFromEffectPort<T> = InferFptsMapping<
  EffectPortEnv<T>
>;

type ContextEnv<T> = T extends Context.Context<infer Env> ? Env : never;

type InferFptsMappingFromEffectContextImpl<T> = T extends AnyFptsConvertible
  ? InferFptsMapping<T>
  : never;

export type InferFptsMappingFromEffectContext<T> =
  InferFptsMappingFromEffectContextImpl<ContextEnv<T>>;
