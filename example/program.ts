import { Context, Effect, Layer, ManagedRuntime, pipe } from "effect";
import * as rte from "fp-ts/ReaderTaskEither";
import type { ReaderTaskEither as RTE } from "fp-ts/ReaderTaskEither";

import {
  contextToFpts,
  effectFunctionToFpts,
  getFptsMapping,
  portToFpts,
  type FptsAccess,
  type FptsConvertible,
} from "@inato/effect-fpts-interop";

// domain
class Foo {
  constructor(readonly id: string) {}
  static make = () => new Foo("random-id");
}

// ports & adapters
interface FooRepository extends FptsConvertible<"fooRepository"> {
  getById: (id: string) => Effect.Effect<Foo, Error>;
  store: (foo: Foo) => Effect.Effect<void, Error>;
}

interface FooRepositoryAccess extends FptsAccess<FooRepository> {}

const FooRepositoryTag = Context.GenericTag<FooRepository>("FooRepository");

const FooRepositoryFptsMapping = getFptsMapping(
  FooRepositoryTag,
  "fooRepository"
);

const FooRepository = Effect.serviceFunctions(FooRepositoryTag);

const FooRepositoryFpts = portToFpts(FooRepository, FooRepositoryFptsMapping);

declare const FooRepositoryLive: Layer.Layer<FooRepository>;

interface TransformFooService extends FptsConvertible<"transformFooService"> {
  transform: (foo: Foo) => Effect.Effect<Foo, Error>;
}

interface TransformFooServiceAccess extends FptsAccess<TransformFooService> {}

const TransformFooServiceTag = Context.GenericTag<TransformFooService>(
  "TransformFooService"
);

const TransformFooServiceFptsMapping = getFptsMapping(
  TransformFooServiceTag,
  "transformFooService"
);

const TransformFooService = Effect.serviceFunctions(TransformFooServiceTag);

const TransformFooServiceFpts = portToFpts(
  TransformFooService,
  TransformFooServiceFptsMapping
);

declare const TransformFooServiceLive: Layer.Layer<TransformFooService>;

// usecases
export const createFooUseCase: RTE<FooRepositoryAccess, Error, Foo> = pipe(
  rte.of(Foo.make()),
  rte.tap(FooRepositoryFpts.store)
);

export const transformFooUseCase = (id: string) =>
  FooRepository.getById(id).pipe(
    Effect.flatMap(TransformFooService.transform),
    Effect.flatMap(FooRepository.store)
  );

export const transformFooUseCaseFpts = effectFunctionToFpts(
  transformFooUseCase,
  {
    ...TransformFooServiceFptsMapping,
    ...FooRepositoryFptsMapping,
  }
);

// program
const main = async () => {
  const runtime = ManagedRuntime.make(
    Layer.mergeAll(FooRepositoryLive, TransformFooServiceLive)
  );

  await runtime.runPromise(transformFooUseCase("my-foo-id"));

  const { context } = await runtime.runtime();

  const services = contextToFpts(context, {
    ...TransformFooServiceFptsMapping,
    ...FooRepositoryFptsMapping,
  });

  await createFooUseCase(services)();
};
main();
