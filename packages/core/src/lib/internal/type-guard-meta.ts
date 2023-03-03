import { TypeClassification, TypeGuardMeta } from '.';
import { AnyTypeGuard, TypeGuard } from '..';

const invalidTypeGuard = 'Invalid type guard provided';

const typeGuardMeta: WeakMap<TypeGuard, TypeGuardMeta> = new WeakMap();

/**
 * Extract type guard meta
 */
export const getTypeGuardMeta = (type: TypeGuard): TypeGuardMeta => {
  const meta = typeGuardMeta.get(type);

  // Validate type guard meta
  if (!meta) {
    throw TypeError(invalidTypeGuard);
  }

  return meta;
};

/**
 * Assert for base type guards
 */
export const assertBaseTypeGuard = (classification: TypeClassification) => {
  // Check for optional type
  if (classification === 'optional') {
    throw TypeError('Invalid use of optional type');
  }

  // Check for rest type
  if (classification === 'rest') {
    throw TypeError('Invalid use of tuple rest');
  }
};

/**
 * Check for any type guard
 */
export const isAnyTypeGuard = (type: TypeGuard): type is AnyTypeGuard =>
  getTypeGuardMeta(type).classification === 'any';

/**
 * Check for key type guard
 */
export const isKeyTypeGuard = (
  type: TypeGuard
): type is TypeGuard<keyof any> => {
  const meta = getTypeGuardMeta(type);

  // Switch on type classification
  switch (meta.classification) {
    case 'literal':
    case 'literals':
    case 'template-literal': {
      return true;
    }

    case 'primitive': {
      return (
        (meta.primitive === 'number' && meta.finite) ||
        meta.primitive === 'string' ||
        meta.primitive === 'symbol'
      );
    }

    case 'union': {
      return meta.union.every(isKeyTypeGuard);
    }

    default: {
      return false;
    }
  }
};

/**
 * Check for string type guard
 */
export const isStringTypeGuard = (
  type: TypeGuard
): type is TypeGuard<string> => {
  const meta = getTypeGuardMeta(type);

  return meta.classification === 'primitive' && meta.primitive === 'string';
};

/**
 * Save type guard meta
 */
export const setTypeGuardMeta = (type: TypeGuard, meta: TypeGuardMeta) => {
  typeGuardMeta.set(type, meta);
};
