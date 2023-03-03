import { InferShape, Shape, TypeGuard } from '.';
import { TransformFunction } from '.';
import { getType } from './get-type';
import { ObjectTypeGuardMeta } from './internal';
import { hasAtLeastOneElement } from './internal/array-checks';
import { invalidShape } from './internal/errors';
import { getTypeGuardMeta, setTypeGuardMeta } from './internal/type-guard-meta';
import { isLiteralOf } from './literal';
import { isNever } from './never';
import { parseType } from './parse-type';

const { isArray } = Array;
const { entries, fromEntries, keys } = Object;
const { hasOwnProperty } = Object.prototype;

const expectedKeys = 'expected strings or array of strings';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidObjectType = 'Invalid type provided, expected an object type';
const invalidMapping = 'Invalid object mapping provided';

/**
 * Determines whether an object has a property with the specified name
 */
const hasOwn = <R extends Record<string, any>>(
  object: R,
  key: string | number | symbol
): key is keyof R => hasOwnProperty.call(object, key);

/**
 * Check for object shape
 */
const checkObjectShape = (
  meta: ObjectTypeGuardMeta,
  value: unknown
): boolean => {
  // Check for non-object values
  if (value === null || typeof value !== 'object') {
    return false;
  }

  // Check the required properties
  for (const [key, type] of meta.required) {
    if (!hasOwn(value, key) || !type(value[key])) {
      return false;
    }
  }

  // Check the optional properties
  for (const [key, type] of meta.optional) {
    if (hasOwn(value, key) && !type(value[key])) {
      return false;
    }
  }

  // Check for strict object validation
  if (meta.strict) {
    // Check for unrecognized keys
    for (const key of keys(value)) {
      if (!meta.keys.includes(key)) {
        return false;
      }
    }

    return true;
  }

  // Check for object mapping
  if (meta.mapping) {
    return meta.mapping(value);
  }

  return true;
};

/**
 * Get object description from the provided annotation and strict flag
 */
const getObjectDescription = (annotation: string, strict: boolean) => {
  // Check for strict object
  if (strict) {
    return `an object of strict shape ${annotation}`;
  }

  return `an object of shape ${annotation}`;
};

/**
 * Create object type guard meta
 */
const createObjectMeta = <
  S extends Shape,
  M extends TypeGuard<Record<keyof any, any>> | undefined = undefined
>(
  shape: S,
  strict: boolean,
  mapping?: M
): ObjectTypeGuardMeta => {
  const annotation = getObjectAnnotation(shape, mapping);

  const all = entries(shape).sort(([first], [second]) =>
    first.localeCompare(second)
  );

  const required = all.filter((entry) => {
    const meta = getTypeGuardMeta(entry[1]);

    return meta.classification !== 'optional';
  });

  const optional = all.filter((entry) => {
    const meta = getTypeGuardMeta(entry[1]);

    return meta.classification === 'optional';
  });

  return {
    annotation,
    classification: 'object',
    description: getObjectDescription(annotation, strict),
    keys: keys(shape),
    mapping,
    optional,
    required,
    same: false,
    strict,
  };
};

/**
 * Get object annotation from the provided shape
 */
const getObjectMappingAnnotation = <
  M extends TypeGuard<Record<keyof any, any>> | undefined = undefined
>(
  mapping?: M
): string => {
  // Check for no or empty mapping
  if (!mapping) {
    return '';
  }

  const meta = getTypeGuardMeta(mapping);

  // Switch on mapping classification
  switch (meta.classification) {
    case 'object': {
      // Check for strict object to invalidate the mapping
      if (meta.strict) {
        throw TypeError(invalidMapping);
      }

      return meta.annotation.slice(1 + 1, -1);
    }

    case 'record': {
      const keyType = getTypeGuardMeta(meta.keys).annotation;
      const valueType = getTypeGuardMeta(meta.values).annotation;

      return ` [x: ${keyType}]: ${valueType};\n`;
    }

    default: {
      throw TypeError(invalidMapping);
    }
  }
};

/**
 * Get object annotation from the provided shape
 */
const getObjectAnnotation = <
  S extends Shape,
  M extends TypeGuard<Record<keyof any, any>> | undefined
>(
  shape: S,
  mapping?: M
) => {
  const mappingAnnotation = getObjectMappingAnnotation(mapping);

  // Check for empty shape
  if (keys(shape).length === 0) {
    // Check for mapping to display it if available
    if (mappingAnnotation) {
      return `{\n${mappingAnnotation}}`;
    }

    return '{}';
  }

  return `{\n${mappingAnnotation}${entries(shape)
    .map(([key, type]) => {
      const { annotation, classification } = getTypeGuardMeta(type);

      // Check for optional type guard
      if (classification === 'optional') {
        return ` "${key}"?: ${annotation};\n`;
      }

      return ` "${key}": ${annotation};\n`;
    })
    .join('')}}`;
};

/**
 * Check for keys of provided object type
 */
const isKeyOf = <R extends Record<keyof any, any>>(
  type: TypeGuard<R>
): TypeGuard<keyof R> => {
  const meta = getTypeGuardMeta(type);

  // Check for object type guard
  if (meta.classification !== 'object') {
    throw TypeError(invalidObjectType);
  }

  // Check for at least one property in object schema
  if (hasAtLeastOneElement(meta.keys)) {
    /** @type {TypeGuard<keyof R>} */
    const check = isLiteralOf(meta.keys);

    return check;
  }

  return isNever;
};

/**
 * Check for object values
 */
function isObjectOf<
  S extends Shape,
  M extends TypeGuard<Record<keyof any, any>> | undefined = undefined
>(shape: S, mapping?: M): TypeGuard<InferShape<S, M>> {
  // Check for non-object shapes
  if (shape === null || typeof shape !== 'object') {
    throw TypeError(invalidShape);
  }

  const meta = createObjectMeta(shape, false, mapping);

  const check: TypeGuard<InferShape<S, M>> = (
    value: unknown
  ): value is InferShape<S, M> => checkObjectShape(meta, value);

  // Save type guard meta
  setTypeGuardMeta(check, meta);

  return check;
}

/**
 * Check for a subset object value
 */
const isPartFrom = <R extends Record<string, any>, K extends keyof R>(
  type: TypeGuard<R>,
  names: K | K[],
  pick: boolean
): TypeGuard => {
  const meta = getTypeGuardMeta(type);

  // Check for object type
  if (meta.classification !== 'object') {
    throw TypeError(invalidObjectType);
  }

  // Check for valid names type guard
  if (
    typeof names !== 'string' &&
    !(isArray(names) && names.some((name) => typeof name === 'string'))
  ) {
    throw TypeError(invalidKeysType);
  }

  const shape = fromEntries(
    [...meta.required, ...meta.optional].filter(([key]) => {
      // Check for key array
      if (isArray(names)) {
        // Check for pick mode
        if (pick) {
          return names.some((name) => key === name);
        }

        return !names.some((name) => key === name);
      }

      // Check for pick mode
      if (pick) {
        return key === names;
      }

      return key !== names;
    })
  );

  // Check for strict object type
  if (meta.strict) {
    const check: TypeGuard = isStrictObjectOf(shape);

    return check;
  }

  /** @type {TypeGuard} */
  const check = isObjectOf(shape, meta.mapping);

  return check;
};

/**
 * Check for a subset object value by omitting the provided keys
 */
function isOmitFrom<R extends Record<keyof any, any>, K extends keyof R>(
  type: TypeGuard<R>,
  names: K | K[]
): TypeGuard<Omit<R, K>> {
  return isPartFrom(type, names, false);
}

/**
 * Check for a subset object value by picking the provided keys
 */
function isPickFrom<R extends Record<keyof any, any>, K extends keyof R>(
  type: TypeGuard<R>,
  names: K | K[]
): TypeGuard<Pick<R, K>> {
  return isPartFrom(type, names, true);
}

/**
 * Check for strict object values
 */
function isStrictObjectOf<S extends Shape>(shape: S): TypeGuard<InferShape<S>> {
  // Check for non-object shapes
  if (shape === null || typeof shape !== 'object') {
    throw TypeError(invalidShape);
  }

  const meta = createObjectMeta(shape, true);

  const check: TypeGuard<InferShape<S>> = (
    value: unknown
  ): value is InferShape<S> => checkObjectShape(meta, value);

  // Save type guard meta
  setTypeGuardMeta(check, meta);

  return check;
}

/**
 * Extract object values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
function getObjectOf<S extends Shape>(
  shape: S,
  initial: InferShape<S>
): TransformFunction<InferShape<S>> {
  return getType(isObjectOf(shape), initial);
}

/**
 * Extract strict object values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
function getStrictObjectOf<S extends Shape>(
  shape: S,
  initial: InferShape<S>
): TransformFunction<InferShape<S>> {
  return getType(isStrictObjectOf(shape), initial);
}

/**
 * Extract and validate object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
function parseObjectOf<S extends Shape>(
  shape: S
): TransformFunction<InferShape<S>> {
  return parseType(isObjectOf(shape));
}

/**
 * Extract and validate strict object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
function parseStrictObjectOf<S extends Shape>(
  shape: S
): TransformFunction<InferShape<S>> {
  return parseType(isStrictObjectOf(shape));
}

export {
  getObjectOf,
  getStrictObjectOf,
  isKeyOf,
  isObjectOf,
  isOmitFrom,
  isPickFrom,
  isStrictObjectOf,
  isKeyOf as keyof,
  isObjectOf as object,
  isOmitFrom as omit,
  parseObjectOf,
  parseStrictObjectOf,
  isPickFrom as pick,
  isStrictObjectOf as strictObject,
};
