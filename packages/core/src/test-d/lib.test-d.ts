import { expectType } from 'tsd';
import * as lib from '../lib';
import {
  AnyTypeGuard,
  OptionalTypeGuard,
  RestTypeGuard,
  TransformFunction,
  TypeGuard,
} from '../lib';

// Any
expectType<typeof lib.any>(lib.isAny);
expectType<AnyTypeGuard>(lib.any);

// Array
expectType<typeof lib.array>(lib.isArrayOf);
expectType<TypeGuard<string[]>>(lib.array(lib.string));

// BigInt
expectType<typeof lib.bigint>(lib.isBigInt);
expectType<TypeGuard<bigint>>(lib.bigint);

// Boolean
expectType<typeof lib.boolean>(lib.isBoolean);
expectType<TypeGuard<boolean>>(lib.boolean);

// Date
expectType<typeof lib.date>(lib.isDate);
expectType<TypeGuard<Date>>(lib.date);

// Function
expectType<typeof lib.func>(lib.isFunction);
expectType<TypeGuard<() => void>>(lib.func([]));
expectType<TypeGuard<() => string>>(lib.func([], lib.string));
expectType<TypeGuard<(args_0: string) => void>>(lib.func([lib.string]));
expectType<TypeGuard<(args_0: string) => string>>(
  lib.func([lib.string], lib.string)
);
expectType<TypeGuard<(args_0: string, args_1: string) => void>>(
  lib.func([lib.string, lib.string])
);
expectType<TypeGuard<(args_0: string, args_1: string) => string>>(
  lib.func([lib.string, lib.string], lib.string)
);

// Instance
expectType<typeof lib.instance>(lib.isInstanceOf);
expectType<TypeGuard<Date>>(lib.instance(Date));

// Intersection
expectType<typeof lib.intersection>(lib.isIntersectionOf);
expectType<TypeGuard<{ a: string; b: string; c: string }>>(
  lib.intersection([
    lib.object({ a: lib.string }),
    lib.object({ b: lib.string }),
    lib.object({ c: lib.string }),
  ])
);
expectType<TypeGuard<string>>(
  lib.intersection([
    lib.string,
    lib.union([lib.string, lib.number]),
    lib.union([lib.string, lib.boolean]),
  ])
);

// Literal
expectType<typeof lib.literal>(lib.isLiteral);
expectType<typeof lib.literals>(lib.isLiteralOf);
expectType<TypeGuard<0>>(lib.literal(0));
expectType<TypeGuard<0>>(lib.literals([0]));
expectType<TypeGuard<0 | 1>>(lib.literals([0, 1]));
expectType<TypeGuard<0 | 0n>>(lib.literals([0, 0n]));
expectType<TypeGuard<0 | 0n | ''>>(lib.literals([0, 0n, '']));
expectType<TypeGuard<0 | 0n | '' | false>>(lib.literals([0, 0n, '', false]));
expectType<TypeGuard<0 | 0n | '' | false | null>>(
  lib.literals([0, 0n, '', false, null])
);
expectType<TypeGuard<0 | 0n | '' | false | null | undefined>>(
  lib.literals([0, 0n, '', false, null, undefined])
);

// Never
expectType<typeof lib.never>(lib.isNever);
expectType<TypeGuard<never>>(lib.never);

// Null
expectType<typeof lib.nulled>(lib.isNull);
expectType<typeof lib.nullable>(lib.isNullable);
expectType<typeof lib.nullish>(lib.isNullish);
expectType<TypeGuard<null>>(lib.nulled);
expectType<TypeGuard<string | null>>(lib.nullable(lib.string));
expectType<TypeGuard<string | null | undefined>>(lib.nullish(lib.string));

// Number
expectType<typeof lib.number>(lib.isNumber);
expectType<TypeGuard<number>>(lib.number);

// Object
expectType<typeof lib.object>(lib.isObjectOf);
expectType<typeof lib.strictObject>(lib.isStrictObjectOf);
expectType<typeof lib.pick>(lib.isPickFrom);
expectType<typeof lib.omit>(lib.isOmitFrom);
expectType<TypeGuard<{ a: string }>>(lib.object({ a: lib.string }));
expectType<TypeGuard<{ a: string }>>(lib.strictObject({ a: lib.string }));
expectType<TypeGuard<{ a: string }>>(
  lib.pick(lib.object({ a: lib.string, b: lib.string }), 'a')
);
expectType<TypeGuard<{ b: string }>>(
  lib.omit(lib.object({ a: lib.string, b: lib.string }), 'a')
);

// Optional
expectType<typeof lib.optional>(lib.isOptional);
expectType<typeof lib.optionalUndef>(lib.isOptionalUndefined);
expectType<OptionalTypeGuard<string>>(lib.optional(lib.string));
expectType<OptionalTypeGuard<string | undefined>>(
  lib.optionalUndef(lib.string)
);

// Partial
expectType<typeof lib.partial>(lib.isPartial);
expectType<typeof lib.partialUndef>(lib.isPartialUndefined);
expectType<TypeGuard<[string?]>>(lib.partial(lib.tuple([lib.string])));
expectType<TypeGuard<{ a?: string }>>(
  lib.partial(lib.object({ a: lib.string }))
);
expectType<TypeGuard<[(string | undefined)?]>>(
  lib.partialUndef(lib.tuple([lib.string]))
);
expectType<TypeGuard<{ a?: string | undefined }>>(
  lib.partialUndef(lib.object({ a: lib.string }))
);

// Record
expectType<typeof lib.record>(lib.isRecordOf);
expectType<TypeGuard<Record<string, string>>>(lib.record(lib.string));
expectType<TypeGuard<Record<string, string>>>(
  lib.record(lib.string, lib.string)
);

// Required
expectType<typeof lib.required>(lib.isRequired);
expectType<TypeGuard<[string]>>(
  lib.required(lib.tuple([lib.optional(lib.string)]))
);

// String
expectType<typeof lib.string>(lib.isString);
expectType<TypeGuard<string>>(lib.string);

// Symbol
expectType<typeof lib.symbol>(lib.isSymbol);
expectType<TypeGuard<symbol>>(lib.symbol);

// Template literal
expectType<typeof lib.templateLiteral>(lib.isTemplateLiteralOf);
expectType<TypeGuard<''>>(lib.templateLiteral([]));
expectType<TypeGuard<''>>(lib.templateLiteral(['']));
expectType<TypeGuard<'0'>>(lib.templateLiteral([0]));
expectType<TypeGuard<'false'>>(lib.templateLiteral([false]));
expectType<TypeGuard<'false' | 'true'>>(lib.templateLiteral([lib.boolean]));
expectType<TypeGuard<string>>(lib.templateLiteral([lib.string]));
expectType<TypeGuard<`${number}`>>(lib.templateLiteral([lib.number]));
expectType<TypeGuard<`${string}false` | `${string}true`>>(
  lib.templateLiteral([lib.string, lib.boolean])
);
expectType<TypeGuard<`${string}-false` | `${string}-true`>>(
  lib.templateLiteral([lib.string, '-', lib.boolean])
);

// Tuple
expectType<typeof lib.tuple>(lib.isTupleOf);
expectType<typeof lib.tupleRest>(lib.isTupleRestOf);
expectType<TypeGuard<[]>>(lib.tuple([]));
expectType<TypeGuard<[[]]>>(lib.tuple([lib.tuple([])]));
expectType<TypeGuard<[string]>>(lib.tuple([lib.string]));
expectType<TypeGuard<[[string]]>>(lib.tuple([lib.tuple([lib.string])]));
expectType<RestTypeGuard<string>>(lib.tupleRest(lib.string));
expectType<TypeGuard<string[]>>(lib.tuple([lib.tupleRest(lib.string)]));
expectType<TypeGuard<[string, ...string[]]>>(
  lib.tuple([lib.string, lib.tupleRest(lib.string)])
);
expectType<TypeGuard<[...string[], string]>>(
  lib.tuple([lib.tupleRest(lib.string), lib.string])
);
expectType<TypeGuard<[string?, ...string[]]>>(
  lib.tuple([lib.optional(lib.string), lib.tupleRest(lib.string)])
);
expectType<TypeGuard<[string, string?, ...string[]]>>(
  lib.tuple([lib.string, lib.optional(lib.string), lib.tupleRest(lib.string)])
);

// Undefined
expectType<typeof lib.undef>(lib.isUndefined);
expectType<TypeGuard<undefined>>(lib.undef);

// Union
expectType<typeof lib.union>(lib.isUnionOf);
expectType<TypeGuard<string | number>>(lib.union([lib.string, lib.number]));

// Object + Optional
expectType<TypeGuard<{ a?: string }>>(
  lib.object({ a: lib.optional(lib.string) })
);
expectType<TypeGuard<{ a?: string | undefined }>>(
  lib.object({ a: lib.optionalUndef(lib.string) })
);

// Object + Record
expectType<TypeGuard<{ [x: string]: string; a: string }>>(
  lib.object({ a: lib.string }, lib.record(lib.string, lib.string))
);

// Tuple + Optional
expectType<TypeGuard<[string?]>>(lib.tuple([lib.optional(lib.string)]));
expectType<TypeGuard<[(string | undefined)?]>>(
  lib.tuple([lib.optionalUndef(lib.string)])
);

// Get type
expectType<TransformFunction<string>>(lib.getType(lib.string, ''));

// Parse type
expectType<TransformFunction<string>>(lib.parseType(lib.string));
