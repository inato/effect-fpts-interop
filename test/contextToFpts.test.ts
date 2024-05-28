import { Context, Effect } from "effect";
import { type FptsConvertible } from "../src/FptsConvertible";
import { contextToFpts } from "../src/contextToFpts";

it("contextToFpts", async () => {
  interface Service extends FptsConvertible<"service"> {
    foo: (a: string) => Effect.Effect<string, Error>;
  }
  const tag = Context.GenericTag<Service>("@services/tag");

  interface Service2 extends FptsConvertible<"service2"> {
    bar: (a: string) => Effect.Effect<string, Error>;
  }
  const tag2 = Context.GenericTag<Service2>("@services2/tag");

  interface Service3 extends FptsConvertible<"service3"> {
    baz: (a: string) => Effect.Effect<string, Error>;
  }
  const tag3 = Context.GenericTag<Service3>("@services3/tag");

  const context: Context.Context<Service | Service2 | Service3> =
    Context.empty().pipe(
      Context.add(tag, { foo: () => Effect.succeed("foo") }),
      Context.add(tag2, { bar: () => Effect.succeed("bar") }),
      Context.add(tag3, { baz: () => Effect.succeed("baz") })
    );

  const { service, service2, service3 } = contextToFpts(context, {
    service: tag,
    service2: tag2,
    service3: tag3,
  });

  expect(service.foo("").pipe(Effect.runSync)).toBe("foo");
  expect(service2.bar("").pipe(Effect.runSync)).toBe("bar");
  expect(service3.baz("").pipe(Effect.runSync)).toBe("baz");
});
