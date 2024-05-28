import type { Context } from "effect";
import type { ContextTagMapping } from "./internal/InferFptsMapping";
import type { AnyFptsConvertible, FptsIdOf } from "./FptsConvertible";

export const getFptsMapping: <I, S extends AnyFptsConvertible>(
  tag: Context.Tag<I, S>,
  name: FptsIdOf<S>
) => ContextTagMapping<S> = (tag, name) =>
  // @ts-expect-error
  ({
    [name]: tag,
  });
