import { Context, Effect, Either } from "effect";
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
import type { InferFptsMappingFromEffectPort } from "./internal/InferFptsMapping";
import type { Reader } from "fp-ts/Reader";
import type { Task } from "fp-ts/Task";
import { portToFpts } from "./portToFpts";
import type { PortToFpts } from "./internal/PortToFpts";

// @ts-expect-error "Type '"fun"' cannot be used to index type 'PortToFpts<{ fun: F; }, M>'"
type FunctionToFpts<F, M> = PortToFpts<{ fun: F }, M>["fun"];

export const functionToFpts: <
  F,
  M extends InferFptsMappingFromEffectPort<{ fun: F }>
>(
  fun: F,
  mapping: M
) => FunctionToFpts<F, M> = (fun, mapping) => {
  const {
    //@ts-expect-error "fun does not exist"
    fun: fun_,
  } = portToFpts({ fun }, mapping);

  return fun_;
};
