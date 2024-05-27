import { Either } from "effect";
import { either } from "fp-ts";

export const eitherFromFpts: <A, E>(
  e: either.Either<E, A>
) => Either.Either<A, E> = either.matchW(Either.left, Either.right);

// export const rteEff: <R, E, A>(
//   x: ReaderTaskEither<R, E, A>,
// ) => ReaderTaskEitherEff<R, E, A> = readerTask.map(eitherFromFpts);

// export const optionFromFpts: <A>(ma: option.Option<A>) => Option.Option<A> =
//   option.matchW(Option.none, Option.some);

// export const effectFromTaskEither = <E, A>(
//   program: TaskEither<E, A>,
// ): Effect.Effect<A, E> =>
//   pipe(Effect.promise(program), Effect.flatMap(eitherFromFpts));
