import type { InferFptsMappingFromFptsPort } from "./internal/InferFptsMapping";
import { type PortToEffect } from "./internal/PortToEffect";
import { portToEffect } from "./portToEffect";

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
