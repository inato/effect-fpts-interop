import { Context, Effect } from "effect";
import {
  makeAnyFptsConverible,
  type FptsConvertible,
} from "./internal/FptsConvertible";
import type { InferFptsMappingFromEffectFunction } from "./internal/InferFptsMapping";
import { effectFunctionToFpts } from "./effectFunctionToFpts";
import { either } from "fp-ts";

it("effectFunctionToFpts", async () => {
  interface Service extends FptsConvertible<"service"> {
    foo(a: string): Effect.Effect<string, Error>;
  }
  const tag = Context.GenericTag<Service>("@services/tag");

  const fun = (x: string): Effect.Effect<string, Error, Service> =>
    Effect.gen(function* (_) {
      const service = yield* _(tag);
      return x + (yield* _(service.foo("x")));
    });

  type t = InferFptsMappingFromEffectFunction<typeof fun>;

  const funFpts = effectFunctionToFpts(fun, {
    service: tag,
  });

  const res = await funFpts("value")({
    service: tag.of(
      makeAnyFptsConverible({
        foo(a: string) {
          return Effect.succeed(a);
        },
      })
    ),
  })();

  assert(either.isRight(res));
  expect(res.right).toEqual("valuex");
});
