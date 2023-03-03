import {
  BaseTypeGuard,
  InferTypeGuard,
  OptionalTypeGuard,
  PartialUndefined,
  TypeGuard,
} from '.';
import { isArrayOf } from './array';
import { ShapeEntries } from './internal';
import { invalidPartial } from './internal/errors';
import { getTypeGuardMeta } from './internal/type-guard-meta';
import { isStrictObjectOf, isObjectOf } from './object';
import { isOptional, isOptionalUndefined } from './optional';
import { isRecordOf } from './record';
import { isTupleOf } from './tuple';
import { isUndefined } from './undefined';
import { isUnionOf } from './union';

const { fromEntries } = Object;

/**
 * Convert type guard to strict optional type guard
 */
const toOptional = (type: TypeGuard): OptionalTypeGuard => {
  const meta = getTypeGuardMeta(type);

  // Check for optional type guard
  if (meta.classification === 'optional') {
    // Switch optional undefined type guard to strict optional type guard
    if (meta.undef) {
      return isOptional(meta.type);
    }

    return meta.main;
  }

  return isOptional(type);
};

/**
 * Convert entry to strict optional type guard entry
 */
const toOptionalEntry = (entry: [string, TypeGuard]): [string, TypeGuard] => [
  entry[0],
  toOptional(entry[1]),
];

/**
 * Convert type guard to optional undefined type guard
 */
const toOptionalUndefined = (type: TypeGuard): OptionalTypeGuard => {
  const meta = getTypeGuardMeta(type);

  // Check for optional type guard
  if (meta.classification === 'optional') {
    // Check for optional undefined type guard
    if (meta.undef) {
      return meta.main;
    }

    return isOptionalUndefined(meta.type);
  }

  return isOptionalUndefined(type);
};

/**
 * Convert entry to optional undefined type guard entry
 */
const toOptionalUndefinedEntry = (
  entry: [string, TypeGuard]
): [string, TypeGuard] => [entry[0], toOptionalUndefined(entry[1])];

/**
 * Decide what optional type guard to use for type guard conversion
 */
const decideOptional = (
  undef: boolean
): ((type: TypeGuard) => OptionalTypeGuard) => {
  // Check for undefined version
  if (undef) {
    return toOptionalUndefined;
  }

  return toOptional;
};

/**
 * Convert entries to optional type guard entries
 */
const entriesToOptional = (
  entries: ShapeEntries,
  undef: boolean
): ShapeEntries => {
  // Check for undefined version
  if (undef) {
    return entries.map(toOptionalUndefinedEntry);
  }

  return entries.map(toOptionalEntry);
};

/**
 * Wrapper for partial object and tuple type guards
 */
const wrapPartial = (type: TypeGuard, undef: boolean): TypeGuard => {
  const meta = getTypeGuardMeta(type);

  // Switch on type classification
  switch (meta.classification) {
    case 'array': {
      return isArrayOf(isUnionOf([meta.type, isUndefined]));
    }

    case 'object': {
      const shape = fromEntries([
        ...entriesToOptional(meta.required, undef),
        ...meta.optional,
      ]);

      // Check for strict object
      if (meta.strict) {
        return isStrictObjectOf(shape);
      }

      // Check for object with mapping
      if (meta.mapping) {
        return isObjectOf(shape, wrapPartial(meta.mapping, undef));
      }

      return isObjectOf(shape);
    }

    case 'record': {
      return isRecordOf(meta.keys, isUnionOf([meta.values, isUndefined]));
    }

    case 'tuple': {
      return isTupleOf(meta.tuple.map(decideOptional(undef)));
    }

    default: {
      throw TypeError(invalidPartial);
    }
  }
};

/**
 * Check for values that have all properties strict optional
 * @note Accepts only object, record, array and tuple type guards
 */
function isPartial<T extends TypeGuard<Record<keyof any, any> | any[]>>(
  type: BaseTypeGuard<T>
): TypeGuard<Partial<InferTypeGuard<T>>> {
  return wrapPartial(type, false);
}

/**
 * Check for values that have all properties optional or undefined
 * @note Accepts only object, record, array and tuple type guards
 */
function isPartialUndefined<
  T extends TypeGuard<Record<keyof any, any> | any[]>
>(type: BaseTypeGuard<T>): TypeGuard<PartialUndefined<InferTypeGuard<T>>> {
  return wrapPartial(type, true);
}

export {
  isPartial,
  isPartialUndefined,
  isPartial as partial,
  isPartialUndefined as partialUndef,
};
