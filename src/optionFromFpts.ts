import { Option } from "effect";
import { option } from "fp-ts";

export const optionFromFpts: <A>(ma: option.Option<A>) => Option.Option<A> =
  option.matchW(Option.none, Option.some);
