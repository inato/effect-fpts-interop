import { Either } from "effect";
import type { Reader } from "fp-ts/Reader";
import type { Task } from "fp-ts/Task";

export interface ReaderTaskEither<R, E, A>
  extends Reader<R, Task<Either.Either<A, E>>> {}
