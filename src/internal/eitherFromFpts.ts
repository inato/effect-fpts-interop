import { Either } from "effect";
import { either } from "fp-ts";

export const eitherFromFpts: <A, E>(
  e: either.Either<E, A>
) => Either.Either<A, E> = either.matchW(Either.left, Either.right);
