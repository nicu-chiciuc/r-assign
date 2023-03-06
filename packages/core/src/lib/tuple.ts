import {
  BaseTypeGuard,
  InferTuple,
  InferTypeGuard,
  RestTag,
  RestTypeGuard,
  Tuple,
  TypeGuard,
} from '.';
import { TransformFunction } from '.';
import { isArrayOf } from './array';
import { getType } from './get-type';
import { TupleTypeGuardMeta } from './internal';
import { hasOneElement } from './internal/array-checks';
import {
  optionalAfterRest,
  restAfterRest,
  requiredAfterOptional,
} from './internal/errors';
import {
  getTypeGuardMeta,
  setTypeGuardMeta,
  assertBaseTypeGuard,
} from './internal/type-guard-meta';
import { parseType } from './parse-type';

const { isArray } = Array;
const { assign, values } = Object;

const invalidTypeGuards = 'Invalid type guards provided';

const restTag: RestTag = { rest: true };

/**
 * Get tuple annotation
 */
const getTupleAnnotation = (tuple: Tuple): string =>
  `[ ${tuple
    .map((type) => {
      const { annotation, classification } = getTypeGuardMeta(type);

      switch (classification) {
        case 'optional': {
          return `${annotation}?`;
        }

        default: {
          return annotation;
        }
      }
    })
    .join(', ')} ]`;

/**
 * Get optional, required and rest indexes for the provided tuple
 */
const getTupleIndexes = (tuple: Tuple): TupleTypeGuardMeta['indexes'] => {
  const indexes = {
    optional: -1,
    required: -1,
    rest: -1,
  };

  // Validate provided type guards
  for (const [index, type] of tuple.entries()) {
    const { classification } = getTypeGuardMeta(type);

    // Switch on type classification
    switch (classification) {
      case 'optional': {
        // Check for optional type on invalid index
        if (indexes.rest >= 0) {
          throw TypeError(optionalAfterRest);
        }

        // Set optional index
        if (indexes.optional < 0) {
          indexes.optional = index;
        }

        break;
      }

      case 'rest': {
        // Check for rest type on invalid index
        if (indexes.rest >= 0) {
          throw TypeError(restAfterRest);
        }

        // Set rest index
        indexes.rest = index;

        break;
      }

      default: {
        // Check for required type after optional
        if (indexes.optional >= 0) {
          throw TypeError(requiredAfterOptional);
        }

        // Set required index
        if (indexes.rest >= 0) {
          // Set required index only for the first element after rest
          if (indexes.required < indexes.rest) {
            indexes.required = index;
          }
        } else {
          indexes.required = index;
        }

        break;
      }
    }
  }

  return indexes;
};

/**
 * Check for tuple values
 */
const isTupleOf = <T extends Tuple>(types: T): TypeGuard<InferTuple<T>> => {
  // Check for valid type guards provided
  if (!isArray(types)) {
    throw TypeError(invalidTypeGuards);
  }

  const tuple: Tuple = values(types);

  // Check for only one rest element in tuple to return an array type guard
  if (hasOneElement(tuple)) {
    const meta = getTypeGuardMeta(tuple[0]);

    // Check for rest type guard
    if (meta.classification === 'rest') {
      const check: TypeGuard = isArrayOf(meta.type);

      return check;
    }
  }

  const annotation = getTupleAnnotation(tuple);
  const indexes = getTupleIndexes(tuple);
  const { optional, required, rest } = indexes;

  const check: TypeGuard<InferTuple<T>> = (
    value: unknown
  ): value is InferTuple<T> => {
    // Check for non-array values or invalid array length
    if (!isArray(value)) {
      return false;
    }

    // Check if value is allowed to be empty
    if (value.length === 0) {
      return optional === 0 || tuple.length === 0;
    }

    // Check for empty tuple
    if (tuple.length === 0) {
      return false;
    }

    let checkIndex = 0;

    return tuple.every((type, index) => {
      // Check for the end of the value validation
      if (checkIndex === value.length) {
        return index >= optional;
      }

      // Check for rest validation
      if (index === rest) {
        // Check for required elements after rest
        if (required > rest) {
          const tail = value.length - tuple.length + required;

          // Check till the end of the rest
          if (checkIndex < tail) {
            do {
              if (!type(value[checkIndex++])) {
                return false;
              }
            } while (checkIndex < tail);
          }
        } else {
          // Check till the end of the value
          do {
            if (!type(value[checkIndex++])) {
              return false;
            }
          } while (checkIndex < value.length);
        }

        return true;
      }

      return type(value[checkIndex++]);
    });
  };

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    classification: 'tuple',
    description: `a tuple of ${annotation}`,
    indexes,
    same: false,
    tuple,
  });

  return check;
};

/**
 * Check for tuple rest
 */
function isTupleRestOf<T extends TypeGuard>(
  type: BaseTypeGuard<T>
): RestTypeGuard<InferTypeGuard<T>> {
  const { annotation, classification } = getTypeGuardMeta(type);

  // Assert for base type guard
  assertBaseTypeGuard(classification);

  const guard: TypeGuard<InferTypeGuard<T>> = (
    value: unknown
  ): value is InferTypeGuard<T> => type(value);

  const check: RestTypeGuard<InferTypeGuard<T>> = assign(guard, restTag);

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation: `...${annotation}[]`,
    classification: 'rest',
    description: `a rest value of ${annotation}`,
    type,
  });

  return check;
}

export {
  isTupleOf,
  isTupleRestOf,
  isTupleOf as tuple,
  isTupleRestOf as tupleRest,
};
