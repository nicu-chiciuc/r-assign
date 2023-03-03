import { BaseTypeGuard, InferTypeGuard, TypeGuard } from '.';
import { ShapeEntries } from './internal';
import { invalidRequired } from './internal/errors';
import { getTypeGuardMeta } from './internal/type-guard-meta';
import { isStrictObjectOf, isObjectOf } from './object';
import { isTupleOf } from './tuple';

const { fromEntries } = Object;

/**
 * Convert type guard to required type guard
 */
const toRequired = (type: TypeGuard): TypeGuard => {
  const meta = getTypeGuardMeta(type);

  // Check for optional type guard
  if (meta.classification === 'optional') {
    return meta.type;
  }

  return type;
};

/**
 * Convert entry to required type guard entry
 */
const toRequiredEntry = (entry: [string, TypeGuard]): [string, TypeGuard] => [
  entry[0],
  toRequired(entry[1]),
];

/**
 * Convert entries to optional type guard entries
 */
const entriesToRequired = (entries: ShapeEntries): ShapeEntries =>
  entries.map(toRequiredEntry);

/**
 * Check for values that have all properties required
 * @note Accepts only object and tuple type guards
 */
function isRequired<T extends TypeGuard<Record<keyof any, any> | any[]>>(
  type: BaseTypeGuard<T>
): TypeGuard<Required<InferTypeGuard<T>>> {
  const meta = getTypeGuardMeta(type);

  // Switch on type classification
  switch (meta.classification) {
    case 'object': {
      const shape = fromEntries([
        ...meta.required,
        ...entriesToRequired(meta.optional),
      ]);

      // Check for strict object
      if (meta.strict) {
        const check: TypeGuard = isStrictObjectOf(shape);

        return check;
      }

      // Check for object with mapping
      if (meta.mapping) {
        const check: TypeGuard = isObjectOf(shape, meta.mapping);

        return check;
      }

      const check: TypeGuard = isObjectOf(shape);

      return check;
    }

    case 'tuple': {
      /** @type {TypeGuard} */
      const check = isTupleOf(meta.tuple.map(toRequired));

      return check;
    }

    default: {
      throw TypeError(invalidRequired);
    }
  }
}

export { isRequired, isRequired as required };
