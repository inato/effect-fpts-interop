import { Context, Effect } from "effect";
import { either } from "fp-ts";
import { type FptsConvertible } from "../src/FptsConvertible";
import { getFptsMapping } from "../src/getFptsMapping";
import { portToFpts } from "../src/portToFpts";

it("portToFpts", async () => {
  interface Service2 extends FptsConvertible<"service2"> {
    bar(a: number): Effect.Effect<number, Error>;
  }
  const tag2 = Context.GenericTag<Service2>("@services/tag2");

  interface Service3 extends FptsConvertible<"service3"> {
    baz(a: number): Effect.Effect<number, Error>;
  }
  const tag3 = Context.GenericTag<Service3>("@services/tag3");

  interface Service {
    foo(a: string): Effect.Effect<string, Error, Service2 | Service3>;
  }

  const tag = Context.GenericTag<Service>("@services/tag");

  const service2 = tag2.of({
    bar(a) {
      return Effect.succeed(a);
    },
  });

  const service3 = tag3.of({
    baz(a) {
      return Effect.succeed(a);
    },
  });

  const service1 = tag.of({
    foo(a) {
      return Effect.gen(function* (_) {
        const srv2 = yield* _(tag2);
        const srv3 = yield* _(tag3);
        const res3 = yield* _(srv3.baz(1));
        return a + (yield* _(srv2.bar(2))) + res3;
      });
    },
  });

  const { foo } = portToFpts(service1, {
    ...getFptsMapping(tag2, "service2"),
    ...getFptsMapping(tag3, "service3"),
  });

  const res = await foo("Service")({ service2, service3 })();

  assert(either.isRight(res));
  expect(res.right).toEqual("Service21");
});
