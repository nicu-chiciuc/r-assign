import { BaseTypeGuard, TypeGuard, RefineFunction, InferTypeGuard } from '.';
import { TransformFunction } from '.';
import { invalidValue } from './internal/invalid-type';
import { refineValue, takeValue } from './internal/pick-value';
import {
  getTypeGuardMeta,
  assertBaseTypeGuard,
} from './internal/type-guard-meta';

/**
 * Extract and validate values based on the provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function parseType<T extends TypeGuard>(
  type: BaseTypeGuard<T>,
  refine?: RefineFunction<InferTypeGuard<T>>
): TransformFunction<InferTypeGuard<T>> {
  const meta = getTypeGuardMeta(type);

  // Assert for base type guard
  assertBaseTypeGuard(meta.classification);

  /**
   * Assert value to be of a valid type
   */
  function assert(
    value: unknown,
    key?: string
  ): asserts value is InferTypeGuard<T> {
    // Throw for invalid value type
    if (!type(value)) {
      throw TypeError(invalidValue(type, value, key));
    }
  }

  // Check for refine function to optimize performance on value processing
  if (refine) {
    return (value: unknown, key: string | undefined) => {
      // Throw for invalid value type
      assert(value, key);

      return refineValue(takeValue(value, meta), type, refine);
    };
  }

  return (value, key) => {
    // Throw for invalid value type
    assert(value, key);

    return takeValue(value, meta);
  };
}

export { parseType };
