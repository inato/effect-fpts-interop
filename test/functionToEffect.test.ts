import { Context, Effect } from "effect";
import { readerTaskEither } from "fp-ts";
import type { ReaderTaskEither } from "fp-ts/ReaderTaskEither";
import { pipe } from "fp-ts/lib/function";
import { type FptsAccess, type FptsConvertible } from "../src/FptsConvertible";
import { portToEffect } from "../src/portToEffect";
import { getFptsMapping } from "../src/getFptsMapping";
import { functionToEffect } from "src/functionToEffect";

it("functionToEffect", async () => {
  interface Service2 extends FptsConvertible<"service2"> {
    bar(a: number): ReaderTaskEither<unknown, Error, number>;
  }
  interface Service2Access extends FptsAccess<Service2> {}

  interface Service3 extends FptsConvertible<"service3"> {
    baz(a: number): ReaderTaskEither<unknown, Error, number>;
  }
  interface Service3Access extends FptsAccess<Service3> {}

  function foo_(a: string) {
    return pipe(
      readerTaskEither.Do,
      readerTaskEither.bind("res2", () =>
        pipe(
          readerTaskEither.ask<Service2Access>(),
          readerTaskEither.flatMap(({ service2 }) => service2.bar(2))
        )
      ),
      readerTaskEither.bindW("res3", () =>
        pipe(
          readerTaskEither.ask<Service3Access>(),
          readerTaskEither.flatMap(({ service3 }) => service3.baz(1))
        )
      ),
      readerTaskEither.map(({ res2, res3 }) => a + res2 + res3)
    );
  }

  const tag2 = Context.GenericTag<Service2>("@services/tag2");
  const tag3 = Context.GenericTag<Service3>("@services/tag3");

  const foo = functionToEffect(foo_, {
    ...getFptsMapping(tag2, "service2"),
    ...getFptsMapping(tag3, "service3"),
  });

  const res = await pipe(
    foo("Foo"),
    Effect.provideService(tag2, {
      bar(a) {
        return readerTaskEither.of(a);
      },
    }),
    Effect.provideService(tag3, {
      baz(a) {
        return readerTaskEither.of(a);
      },
    }),
    Effect.runPromise
  );

  expect(res).toEqual("Foo21");
});
