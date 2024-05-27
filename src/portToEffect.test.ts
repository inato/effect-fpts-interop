import { Context, Effect } from "effect";
import { readerTaskEither } from "fp-ts";
import type { ReaderTaskEither } from "fp-ts/ReaderTaskEither";
import { pipe } from "fp-ts/lib/function";
import { portToEffect } from "./portToEffect";
import {
  makeAnyFptsConverible,
  type FptsAccess,
  type FptsConvertible,
} from "./FptsConvertible";

it("portToEffect", async () => {
  interface Service2 extends FptsConvertible<"service2"> {
    bar(a: number): ReaderTaskEither<unknown, Error, number>;
  }
  interface Service2Access extends FptsAccess<Service2> {}

  interface Service3 extends FptsConvertible<"service3"> {
    baz(a: number): ReaderTaskEither<unknown, Error, number>;
  }
  interface Service3Access extends FptsAccess<Service3> {}

  interface Service4 extends FptsConvertible<"service4"> {
    fizz(a: number): ReaderTaskEither<unknown, Error, number>;
  }
  interface Service4Access extends FptsAccess<Service4> {}

  interface Service {
    foo(
      a: string
    ): ReaderTaskEither<Service2Access & Service3Access, Error, string>;
    foo2(a: string): ReaderTaskEither<Service4Access, Error, string>;
    foo3(a: string): ReaderTaskEither<unknown, Error, string>;
  }

  const service1: Service = {
    foo3(a) {
      return readerTaskEither.of(a);
    },
    foo2(a: string) {
      return pipe(
        readerTaskEither.Do,
        readerTaskEither.bind("res2", () =>
          pipe(
            readerTaskEither.ask<Service4Access>(),
            readerTaskEither.flatMap(({ service4 }) => service4.fizz(2))
          )
        ),
        readerTaskEither.map(({ res2 }) => a + res2)
      );
    },
    foo(a: string) {
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
    },
  };

  const tag2 = Context.GenericTag<Service2>("@services/tag2");
  const tag3 = Context.GenericTag<Service3>("@services/tag3");
  const tag4 = Context.GenericTag<Service4>("@services/tag4");

  const effectifiedService = portToEffect(service1, {
    service2: tag2,
    service3: tag3,
    service4: tag4,
  });
  const { foo, foo2, foo3 } = effectifiedService;

  // type level checking
  const x: {
    foo: (
      a: string
    ) => Effect.Effect<
      string,
      Error,
      Context.Tag.Identifier<typeof tag2 | typeof tag3>
    >;
    foo2: (
      a: string
    ) => Effect.Effect<string, Error, Context.Tag.Identifier<typeof tag4>>;
    foo3: (a: string) => Effect.Effect<string, Error, never>;
  } = { foo, foo2, foo3 };

  x;

  const res = await pipe(
    foo("Service"),
    Effect.provideService(
      tag2,
      makeAnyFptsConverible<Service2>({
        bar(a) {
          return readerTaskEither.of(a);
        },
      })
    ),
    Effect.provideService(
      tag3,
      makeAnyFptsConverible<Service3>({
        baz(a) {
          return readerTaskEither.of(a);
        },
      })
    ),
    Effect.runPromise
  );

  expect(res).toEqual("Service21");
});
