import { Context, Effect, pipe } from "effect";
import type { AnyFptsFunction, FptsFunction } from "./FptsFunction";
import type { InferFptsMappingFromFptsPort } from "./InferFptsMapping";
import { eitherFromFpts } from "./effectFromFpts";

type PortToEffect<P, M> = {
  [k in keyof P as P[k] extends AnyFptsFunction
    ? k
    : never]: P[k] extends FptsFunction<
    infer Args,
    infer Env,
    infer Err,
    infer A
  >
    ? (...args: Args) => Effect.Effect<
        A,
        Err,
        Context.Tag.Identifier<
          //@ts-expect-error "Type 'keyof Env' cannot be used to index type 'Mapping'"
          M[keyof Env]
        >
      >
    : never;
};

export const portToEffect: <P, M extends InferFptsMappingFromFptsPort<P>>(
  port: P,
  mapping: M
) => PortToEffect<P, M> = (port, mapping) =>
  new Proxy({} as any, {
    get(_target, k) {
      return (...args: Array<any>) => {
        return pipe(
          Effect.context(),
          Effect.map((context) => () => {
            const fptsEnv = {};
            for (const fptsKey in mapping) {
              const tag = mapping[fptsKey];
              const opt = Context.getOption(
                context,
                // @ts-expect-error "Argument is not assignable to parameter of type 'Tag<unknown, unknown>'"
                tag
              );
              if (opt._tag === "Some") {
                // @ts-expect-error "Type 'Extract<keyof M, string>' cannot be used to index type '{}'"
                fptsEnv[fptsKey] = opt.value;
              }
            }
            // @ts-expect-error "Element implicitly has an 'any' type because expression of type 'string | symbol' can't be used to index type 'unknown'."
            return port[k](
              // next line is fine
              ...args
            )(fptsEnv)();
          }),
          Effect.flatMap((x) => Effect.promise(x)),
          Effect.flatMap((x) =>
            eitherFromFpts(
              // @ts-expect-error "Argument of type 'unknown' is not assignable to parameter of type 'Either<unknown, unknown>'."
              x
            )
          )
        );
      };
    },
  });
