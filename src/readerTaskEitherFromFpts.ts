import type { ReaderTaskEither as ReaderTaskEitherFpts } from "fp-ts/ReaderTaskEither";
import type { ReaderTaskEither } from "./ReaderTaskEither";
import { readerTask } from "fp-ts";
import { eitherFromFpts } from "./eitherFromFpts";

export const readerTaskEitherFromFpts: <R, E, A>(
  x: ReaderTaskEitherFpts<R, E, A>
) => ReaderTaskEither<R, E, A> = readerTask.map(eitherFromFpts);
