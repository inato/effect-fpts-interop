import { Context, Effect, pipe } from "effect";
import type { AnyFptsFunction, FptsFunction } from "./internal/FptsFunction";
import type { InferFptsMappingFromFptsPort } from "./internal/InferFptsMapping";
import { eitherFromFpts } from "./internal/eitherFromFpts";
import type { EffectFunction } from "./internal/EffectFunction";
import { portToEffect } from "./portToEffect";
import { type PortToEffect } from "./internal/PortToEffect";

// @ts-expect-error "Type '"fun"' cannot be used to index type 'PortToEffect<{ fun: F; }, M>'"
type FunctionToEffect<F, M> = PortToEffect<{ fun: F }, M>["fun"];

export const functionToEffect: <
  F,
  M extends InferFptsMappingFromFptsPort<{ fun: F }>
>(
  fun: F,
  mapping: M
) => FunctionToEffect<F, M> = (fun, mapping) => {
  const {
    //@ts-expect-error "fun does not exist"
    fun: fun_,
  } = portToEffect({ fun }, mapping);

  return fun_;
};
