import type { InferFptsMappingFromEffectPort } from "./internal/InferFptsMapping";
import type { PortToFpts } from "./internal/PortToFpts";
import { portToFpts } from "./portToFpts";

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
