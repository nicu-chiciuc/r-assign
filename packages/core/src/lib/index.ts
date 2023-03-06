type Constructor<T = unknown> = new (...args: unknown[]) => T;

type InferConstructor<T extends Constructor> = T extends Constructor<infer I>
  ? I
  : never;

type Literal = bigint | boolean | null | number | string | undefined;
type Literals<L extends Literal> = [L, ...L[]];

type InferLiterals<
  L extends Literal,
  T extends Literals<L>
> = T extends (infer S)[] ? S : never;

type PartialUndefined<T> = {
  [P in keyof T]?: T[P] | undefined;
};

type TypeGuard<T = any> = (value: unknown) => value is T;
type CompositeTypeGuard<T> = T extends never ? never : TypeGuard<T>;

type AnyTag = { any: true };
type AnyTypeGuard = TypeGuard<any> & AnyTag;

type OptionalTag = { optional: true };
type OptionalTypeGuard<T = unknown> = TypeGuard<T | undefined> & OptionalTag;

export type RestTag = { rest: true };
type RestTypeGuard<T = unknown> = TypeGuard<T[]> & RestTag;

type BaseTypeGuard<T extends TypeGuard<unknown>> = T extends OptionalTypeGuard
  ? never
  : T extends RestTypeGuard
  ? never
  : T;

type InferTypeGuard<G extends TypeGuard<unknown>> = G extends OptionalTypeGuard<
  infer T
>
  ? T
  : G extends TypeGuard<infer T>
  ? T
  : never;

type Intersection = [TypeGuard<any>, TypeGuard<any>, ...TypeGuard<any>[]];

type RemapObject<T> = T extends unknown[] ? T : { [K in keyof T]: T[K] };

type InferIntersection<T extends Intersection> = T extends [infer F, infer S]
  ? F extends TypeGuard<unknown>
    ? S extends TypeGuard<unknown>
      ? InferTypeGuard<F> & InferTypeGuard<S> extends infer I
        ? RemapObject<I>
        : never
      : never
    : never
  : T extends [infer F, infer S, ...infer R]
  ? F extends TypeGuard<unknown>
    ? S extends TypeGuard<unknown>
      ? R extends TypeGuard<unknown>[]
        ? [
            TypeGuard<InferTypeGuard<F> & InferTypeGuard<S>>,
            ...R
          ] extends infer I
          ? I extends Intersection
            ? InferIntersection<I>
            : never
          : never
        : never
      : never
    : never
  : never;

type Stringify<T> = T extends TypeGuard<Literal>
  ? `${InferTypeGuard<T>}`
  : T extends Literal
  ? `${T}`
  : never;

type TemplateLiteral<L extends Literal = Literal> = (TypeGuard<L> | L)[] | [];

type InferTemplateLiteral<T extends TemplateLiteral> = T extends []
  ? ''
  : T extends [infer G]
  ? Stringify<G>
  : T extends [infer H, ...infer R]
  ? H extends TypeGuard<infer O>
    ? O extends object
      ? never
      : R extends TemplateLiteral
      ? `${Stringify<H>}${InferTemplateLiteral<R>}`
      : never
    : H extends Literal
    ? R extends TemplateLiteral
      ? `${Stringify<H>}${InferTemplateLiteral<R>}`
      : never
    : never
  : never;

type Tuple = TypeGuard<any>[] | [];

type InferTupleWithRest<T extends Tuple> = T extends []
  ? []
  : T extends [infer G]
  ? G extends OptionalTypeGuard
    ? never
    : G extends RestTypeGuard
    ? never
    : G extends TypeGuard<unknown>
    ? [InferTypeGuard<G>]
    : never
  : T extends [infer H, ...infer R]
  ? H extends OptionalTypeGuard
    ? never
    : H extends RestTypeGuard
    ? never
    : H extends TypeGuard<unknown>
    ? R extends Tuple
      ? [InferTypeGuard<H>, ...InferTupleWithRest<R>]
      : never
    : never
  : never;

type TransformFunction<T = unknown> = (
  value?: unknown,
  key?: string,
  source?: unknown
) => T;

type InferTupleWithOptional<T extends Tuple> = T extends []
  ? []
  : T extends [infer G]
  ? G extends OptionalTypeGuard
    ? [InferTypeGuard<G>?]
    : G extends RestTypeGuard
    ? InferTypeGuard<G>
    : never
  : T extends [infer H, ...infer R]
  ? H extends OptionalTypeGuard
    ? R extends Tuple
      ? [InferTypeGuard<H>?, ...InferTupleWithOptional<R>]
      : never
    : H extends RestTypeGuard
    ? R extends Tuple
      ? [...InferTypeGuard<H>, ...InferTupleWithRest<R>]
      : never
    : never
  : never;

type InferTuple<T extends Tuple> = T extends []
  ? []
  : T extends [infer G]
  ? G extends OptionalTypeGuard
    ? [InferTypeGuard<G>?]
    : G extends RestTypeGuard
    ? InferTypeGuard<G>
    : G extends TypeGuard<unknown>
    ? [InferTypeGuard<G>]
    : never
  : T extends [infer H, ...infer R]
  ? H extends OptionalTypeGuard
    ? R extends Tuple
      ? [InferTypeGuard<H>?, ...InferTupleWithOptional<R>]
      : never
    : H extends RestTypeGuard
    ? R extends Tuple
      ? [...InferTypeGuard<H>, ...InferTupleWithRest<R>]
      : never
    : H extends TypeGuard<unknown>
    ? R extends Tuple
      ? [InferTypeGuard<H>, ...InferTuple<R>]
      : never
    : never
  : never;

type InferFunction<T extends Tuple, R extends TypeGuard<unknown>> = (
  ...args: InferTuple<T>
) => InferTypeGuard<R>;

type Shape = Record<string, TypeGuard<any>>;

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type OptionalShape<S extends Shape, T extends keyof S> = {
  [K in keyof (Omit<S, T> & Partial<Pick<S, T>>)]: K extends keyof S
    ? InferTypeGuard<S[K]>
    : never;
};

type InferShape<
  S extends Shape,
  M extends TypeGuard<Record<PropertyKey, unknown>> | undefined = undefined
> = RemapObject<
  OptionalShape<S, KeysOfType<S, OptionalTypeGuard>> &
    (M extends undefined
      ? unknown
      : M extends TypeGuard<unknown>
      ? InferTypeGuard<M>
      : never)
>;

type Union = [TypeGuard<any>, TypeGuard<any>, ...TypeGuard<any>[]];

type InferUnion<T extends Union> = T extends TypeGuard<infer U>[] ? U : never;

type RefineFunction<T> = (value: T) => T;

export * from './any';
export * from './array';
export * from './assert-type';
export * from './bigint';
export * from './boolean';
export * from './date';
export * from './function';
export * from './get-type';
export * from './instance';
export * from './intersection';
export * from './literal';
export * from './never';
export * from './null';
export * from './number';
export * from './object';
export * from './optional';
export * from './parse-type';
export * from './partial';
export * from './record';
export * from './required';
export * from './same';
export * from './string';
export * from './symbol';
export * from './template-literal';
export * from './tuple';
export * from './undefined';
export * from './union';

export type {
  AnyTypeGuard,
  AnyTypeGuard as ATG,
  BaseTypeGuard,
  BaseTypeGuard as BTG,
  CompositeTypeGuard,
  CompositeTypeGuard as CTG,
  Constructor,
  InferConstructor,
  InferConstructor as InferC,
  InferFunction,
  InferFunction as InferF,
  InferIntersection,
  InferIntersection as InferInt,
  InferLiterals,
  InferLiterals as InferL,
  InferShape,
  InferShape as InferS,
  InferTemplateLiteral,
  InferTemplateLiteral as InferTL,
  InferTuple,
  InferTuple as InferT,
  InferTypeGuard,
  InferTypeGuard as InferTG,
  InferUnion,
  InferUnion as InferU,
  Intersection,
  Literal,
  Literals,
  OptionalTypeGuard,
  OptionalTypeGuard as OTG,
  PartialUndefined,
  PartialUndefined as PU,
  RefineFunction,
  RefineFunction as RF,
  RestTypeGuard,
  RestTypeGuard as RTG,
  Shape,
  TemplateLiteral,
  TemplateLiteral as TL,
  Tuple,
  TypeGuard,
  TypeGuard as TG,
  Union,
  AnyTag,
  OptionalTag,
  TransformFunction,
};
