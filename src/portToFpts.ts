import { Context, Effect } from "effect";
import type { InferFptsMappingFromEffectPort } from "./internal/InferFptsMapping";
import type { PortToFpts } from "./internal/PortToFpts";

export const portToFpts: <P, M extends InferFptsMappingFromEffectPort<P>>(
  port: P,
  mapping: M
) => PortToFpts<P, M> = (port, mapping) =>
  new Proxy({} as any, {
    get(_target, k) {
      return ((...args: any[]) =>
        (access: any) => {
          const effect =
            //@ts-expect-error
            port[k](...args);
          let ctx = Context.empty();
          for (const m in mapping) {
            if (access[m] !== undefined) {
              ctx = Context.add(
                //@ts-expect-error
                mapping[m],
                access[m]
              )(ctx);
            }
          }
          return () =>
            effect.pipe(
              Effect.provide(ctx as Context.Context<any>),
              Effect.either,
              Effect.runPromise
            );
        }) as any;
    },
  });
