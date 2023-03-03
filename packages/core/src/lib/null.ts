import { BaseTypeGuard, InferTypeGuard, TypeGuard } from '.';
import { TransformFunction } from '.';
import { getType } from './get-type';
import { setTypeGuardMeta } from './internal/type-guard-meta';
import { parseType } from './parse-type';
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

/**
 * Extract null values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @type {TransformFunction<null>}
 */
const getNull = () => null;

/**
 * Extract nullable values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
const getNullable = <T extends TypeGuard>(
  type: BaseTypeGuard<T>
): TransformFunction<InferTypeGuard<T> | null> =>
  getType(isNullable(type), null);

/**
 * Extract and validate null values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
const parseNull: TransformFunction<null> = parseType(isNull);

/**
 * Extract and validate nullable values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
function parseNullable<T extends TypeGuard>(
  type: BaseTypeGuard<T>
): TransformFunction<InferTypeGuard<T> | null> {
  return parseType(isNullable(type));
}

export {
  getNull,
  getNullable,
  isNull,
  isNullable,
  isNullish,
  isNullable as nullable,
  isNull as nulled,
  isNullish as nullish,
  parseNull,
  parseNullable,
};
