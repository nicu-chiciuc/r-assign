/**
 * Asserts that the provided value is of the provided type
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */

import { TypeGuard, BaseTypeGuard, InferTypeGuard } from '.';
import { invalidValue } from './internal/invalid-type';
import {
  getTypeGuardMeta,
  assertBaseTypeGuard,
} from './internal/type-guard-meta';

function assertType<T extends TypeGuard>(
  type: BaseTypeGuard<T>,
  value: unknown,
  message?: string
): asserts value is InferTypeGuard<T> {
  const { classification } = getTypeGuardMeta(type);

  // Assert for base type guard
  assertBaseTypeGuard(classification);

  // Check for default value to be of a valid type
  if (!type(value)) {
    // Check for custom error message provided
    if (message) {
      throw TypeError(message);
    }

    throw TypeError(invalidValue(type, value));
  }
}

export { assertType };
