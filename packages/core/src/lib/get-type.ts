import { RefineFunction, TypeGuard, BaseTypeGuard, InferTypeGuard } from '.';
import { TransformFunction } from '.';
import { invalidInitialValue } from './internal/invalid-type';
import { refineValue, takeValue } from './internal/pick-value';
import {
  getTypeGuardMeta,
  assertBaseTypeGuard,
} from './internal/type-guard-meta';

/**
 * Extract values based on provided type guard and default value
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function getType<T extends TypeGuard>(
  type: BaseTypeGuard<T>,
  initial?: InferTypeGuard<T>,
  refine?: RefineFunction<InferTypeGuard<T>>
): TransformFunction<InferTypeGuard<T>> {
  const meta = getTypeGuardMeta(type);

  // Assert for base type guard
  assertBaseTypeGuard(meta.classification);

  // Check for default value to be of a valid type
  if (!type(initial)) {
    throw TypeError(invalidInitialValue(type, initial));
  }

  // Check for refine function to optimize performance on value processing
  if (refine) {
    return (value: unknown) => {
      // Check for valid value type
      if (type(value)) {
        return refineValue(takeValue(value, meta), type, refine);
      }

      return refineValue(takeValue(initial, meta), type, refine);
    };
  }

  return (value: unknown) => {
    // Check for valid value type
    if (type(value)) {
      return takeValue(value, meta);
    }

    return takeValue(initial, meta);
  };
}

export { getType };
