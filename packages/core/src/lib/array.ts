import { BaseTypeGuard, InferTypeGuard, TypeGuard } from '.';
import { TypeClassification } from './internal';
import {
  assertBaseTypeGuard,
  getTypeGuardMeta,
  setTypeGuardMeta,
} from './internal/type-guard-meta';

const { isArray } = Array;

/**
 * Get array description based on the provided annotation and classification
 */
const getArrayDescription = (
  annotation: string,
  classification: TypeClassification
): string => {
  const description = `an array of ${annotation}`;

  // Add plural for primitive annotation
  if (classification === 'primitive') {
    return `${description}s`;
  }

  return description;
};

/**
 * Check for array values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function isArrayOf<T extends TypeGuard>(
  type: BaseTypeGuard<T>
): TypeGuard<InferTypeGuard<T>[]> {
  const child = getTypeGuardMeta(type);

  // Assert for base type guard
  assertBaseTypeGuard(child.classification);

  const check: TypeGuard<InferTypeGuard<T>[]> = (
    value?: any
  ): value is InferTypeGuard<T>[] => {
    // Check for non-array values
    if (!isArray(value)) {
      return false;
    }

    // Loop array elements to check them
    for (const element of value) {
      if (!type(element)) {
        return false;
      }
    }

    return true;
  };

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation: `${child.annotation}[]`,
    child,
    classification: 'array',
    description: getArrayDescription(child.annotation, child.classification),
    same: false,
    type,
  });

  return check;
}

export { isArrayOf as array, isArrayOf };
