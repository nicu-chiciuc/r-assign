import {
  BaseTypeGuard,
  InferTypeGuard,
  OptionalTag,
  OptionalTypeGuard,
  TypeGuard,
} from '.';
import { invalidOptional } from './internal/errors';
import { getTypeGuardMeta, setTypeGuardMeta } from './internal/type-guard-meta';
import { isUndefined } from './undefined';
import { isUnionOf } from './union';

const { assign } = Object;

const optionalTag: OptionalTag = { optional: true };

/**
 * Get optional annotation
 */
const getOptionalAnnotation = (type: TypeGuard, undef: boolean): string => {
  const { annotation, classification } = getTypeGuardMeta(type);

  // Check for optional type
  if (classification === 'optional') {
    throw TypeError(invalidOptional);
  }

  // Check for undefined optional
  if (undef) {
    return `${annotation} | undefined`;
  }

  return annotation;
};

/**
 * Get optional type guard
 */
const getOptionalTypeGuard = <T extends TypeGuard>(
  type: BaseTypeGuard<T>,
  undef: boolean
): TypeGuard<InferTypeGuard<T>> => {
  // Check for undefined optional
  if (undef) {
    const check = isUnionOf([type, isUndefined]);

    /** @type {} */
    const guard: TypeGuard<InferTypeGuard<T>> = (
      value: unknown
    ): value is InferTypeGuard<T> => check(value);

    return guard;
  }

  const guard: TypeGuard<InferTypeGuard<T>> = (
    value: unknown
  ): value is InferTypeGuard<T> => type(value);

  return guard;
};

/**
 * Wrapper for optional type guards
 */
const wrapOptional = <T extends TypeGuard>(
  type: BaseTypeGuard<T>,
  undef: boolean
): OptionalTypeGuard<InferTypeGuard<T>> => {
  const annotation = getOptionalAnnotation(type, undef);
  const check = assign(getOptionalTypeGuard(type, undef), optionalTag);

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    classification: 'optional',
    description: `an optional value of ${annotation}`,
    main: check,
    type,
    undef,
  });

  return check;
};

/**
 * Check for strict optional values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function isOptional<T extends TypeGuard>(
  type: BaseTypeGuard<T>
): OptionalTypeGuard<InferTypeGuard<T>> {
  return wrapOptional(type, false);
}

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function isOptionalUndefined<T extends TypeGuard>(
  type: BaseTypeGuard<T>
): OptionalTypeGuard<InferTypeGuard<T> | undefined> {
  return wrapOptional(type, true);
}

export {
  isOptional,
  isOptionalUndefined,
  isOptional as optional,
  isOptionalUndefined as optionalUndef,
};
