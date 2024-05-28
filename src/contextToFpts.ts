import { Context, Option } from "effect";
import type { InferFptsMappingFromEffectContext } from "./internal/InferFptsMapping";

type ContextToFpts<M> = {
  [K in keyof M]: M[K] extends
    | Context.Tag<any, any>
    | Context.TagClassShape<any, any>
    ? Context.Tag.Service<M[K]>
    : never;
};

export const contextToFpts: <
  C extends Context.Context<any>,
  M extends Partial<InferFptsMappingFromEffectContext<C>>
>(
  context: C,
  mapping: M
) => ContextToFpts<M> = (context, mapping) => {
  const res: any = {};
  for (const [key, tag] of Object.entries(mapping)) {
    const service = Context.getOption(context, tag);
    if (Option.isSome(service)) {
      res[key] = service.value;
    }
  }
  return res;
};
