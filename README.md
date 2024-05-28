# @inato/effect-fpts-interop

Helper functions to interoperate between the Effect type and the ReaderTaskEither type.

## Installation

You can install this package via pnpm:

```bash
pnpm install @inato/effect-fpts-interop
```

## Usage

### portToEffect
```ts
import {
  getFptsMapping,
  portToEffect,
  type FptsAccess,
  type FptsConvertible,
} from "@inato/effect-fpts-interop";

interface MeasureString extends FptsConvertible<"measureString"> {
  measure: (value: string) => ReaderTaskEither<unknown, Error, number>
}

interface MeasureStringAccess extends FptsAccess<MeasureString> { }

declare const MeasureStringFpts: {
  measure: (value: string) => ReaderTaskEither<MeasureString, Error, number>
}

const Tag = Context.GenericTag<MeasureString>("MeasureString")

const MeasureString = portToEffect(
  MeasureStringFpts, 
  getFptsMapping(Tag, "measureString")
)

MeasureString.measure("hello 👋") // Effect<number, Error, MeasureString>
```

### portToFpts
```ts
import {
  getFptsMapping,
  portToEffect,
  type FptsAccess,
  type FptsConvertible,
} from "@inato/effect-fpts-interop";

interface MeasureString extends FptsConvertible<"measureString"> {
  measure: (value: string) => Effect<number, Error>
}

interface MeasureStringAccess extends FptsAccess<MeasureString> { }

declare const MeasureStringFpts: {
  measure: (value: string) => ReaderTaskEither<MeasureString, Error, number>
}

const Tag = Context.GenericTag<MeasureString>("MeasureString")

const MeasureString = Effect.serviceFunctions(Tag)

const MeasureStringFpts = portToFpts(
  MeasureString, 
  getFptsMapping(Tag, "measureString")
)

MeasureStringFpts.measure("hello 👋") // ReaderTaskEither<MeasureStringAccess, Error, number>
```

And more.. Have a look at the [example](/example/program.ts) section!