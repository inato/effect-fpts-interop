import { Context, Effect } from "effect";
import { either } from "fp-ts";
import { type FptsConvertible } from "../src/FptsConvertible";
import { effectFunctionToFpts } from "../src/effectFunctionToFpts";
import { getFptsMapping } from "../src/getFptsMapping";

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

  const funFpts = effectFunctionToFpts(fun, getFptsMapping(tag, "service"));

  const res = await funFpts("value")({
    service: tag.of({
      foo(a: string) {
        return Effect.succeed(a);
      },
    }),
  })();

  assert(either.isRight(res));
  expect(res.right).toEqual("valuex");
});
