import type { Context } from "effect";
import type { UnionToIntersection } from "effect/Types";
import type {
  AnyFptsConvertible,
  FptsConvertible,
  FptsIdOf,
} from "../FptsConvertible";
import type { EffectFunction } from "./EffectFunction";
import type { FptsFunction } from "./FptsFunction";

export type ContextTagMapping<T> = T extends AnyFptsConvertible
  ? {
      [k in FptsIdOf<T>]: Context.Tag<any, Extract<T, FptsConvertible<k>>>;
    }
  : never;

type InferFptsMapping<T> = Exclude<T, AnyFptsConvertible> extends never
  ? UnionToIntersection<ContextTagMapping<T>>
  : {
      error: `ERROR all ports should derive from FptsConvertible`;
      ports: Exclude<T, AnyFptsConvertible>;
    };

type EmptyIfUnknown<T> = unknown extends T ? {} : T;

type FptsFunctionEnv<T> = EmptyIfUnknown<
  T extends FptsFunction<any, infer Env, any, any> ? Env : unknown
>;

type IsPartial<T> = [T] extends [undefined] ? true : false;

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type RemovePartial<T> = Pick<T, RequiredKeys<T>>;

export type FptsPortEnv<T> = UnionToIntersection<
  { [k in keyof T]: FptsFunctionEnv<T[k]> }[keyof T]
>;

type InferFptsMappingFromFptsPortImpl<T> = InferFptsMapping<T[keyof T]>;

export type InferFptsMappingFromFptsPort<T> = InferFptsMappingFromFptsPortImpl<
  RemovePartial<FptsPortEnv<T>>
>;

type EffectFunctionEnv<T> = EmptyIfUnknown<
  T extends EffectFunction<any, infer Env, any, any> ? Env : unknown
>;

type EffectPortEnv<T> = {
  [k in keyof T]: EffectFunctionEnv<T[k]>;
}[keyof T];

export type InferFptsMappingFromEffectPort<T> = InferFptsMapping<
  EffectPortEnv<T>
>;

type ContextEnv<T> = T extends Context.Context<infer Env> ? Env : never;

export type InferFptsMappingFromServices<T> = UnionToIntersection<
  T extends AnyFptsConvertible ? InferFptsMapping<T> : never
>;

export type InferFptsMappingFromEffectContext<T> = InferFptsMappingFromServices<
  ContextEnv<T>
>;
