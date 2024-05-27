const FptsConvertibleId = Symbol("@inato/effect-fpts-interop/FptsConvertible");
export type FptsConvertibleId = typeof FptsConvertibleId;

export interface FptsConvertible<K extends string> {
  [FptsConvertibleId]: K;
}

export interface AnyFptsConvertible extends FptsConvertible<any> {}

type FptsIdOf<X extends AnyFptsConvertible> = X[FptsConvertibleId];

export type FptsAccess<X extends AnyFptsConvertible> = {
  [k in FptsIdOf<X>]: X;
};
