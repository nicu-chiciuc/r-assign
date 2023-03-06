import { BaseTypeGuard, InferTypeGuard, TypeGuard } from '.';
import { setTypeGuardMeta } from './internal/type-guard-meta';
import { isUndefined } from './undefined';
import { isUnionOf } from './union';

/**
 * Check for null values
 */
const isNull: TypeGuard<null> = (value: unknown): value is null =>
  value === null;

// Save type guard meta
setTypeGuardMeta(isNull, {
  annotation: 'null',
  classification: 'literal',
  description: 'a null value',
  literal: null,
});

/**
 * Check for nullable values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function isNullable<T extends TypeGuard>(
  type: BaseTypeGuard<T>
): TypeGuard<InferTypeGuard<T> | null> {
  return isUnionOf([type, isNull]);
}

/**
 * Check for nullish values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function isNullish<T extends TypeGuard>(
  type: BaseTypeGuard<T>
): TypeGuard<InferTypeGuard<T> | null | undefined> {
  return isUnionOf([type, isNull, isUndefined]);
}

export {
  isNull,
  isNullable,
  isNullish,
  isNullable as nullable,
  isNull as nulled,
  isNullish as nullish,
};
