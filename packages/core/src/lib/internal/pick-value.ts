import {
  ArrayTypeGuardMeta,
  ObjectTypeGuardMeta,
  TupleTypeGuardMeta,
  TypeGuardMeta,
} from '.';
import { TypeGuard, Union } from '..';
import { getTypeGuardMeta } from './type-guard-meta';
import { wrapFunction } from './wrap-function';
import { invalidRefineValue } from './invalid-type';

const invalidUnionType = 'Invalid union type provided';

/**
 * Check for primitive value
 */
const isPrimitive = (value: any): boolean => {
  // Switch on value type
  switch (typeof value) {
    case 'function': {
      return false;
    }

    case 'object': {
      return value === null;
    }

    default: {
      return true;
    }
  }
};

/**
 * Check that all array elements match the provided type
 */
const arrayMatchesType = (value: any[], meta: TypeGuardMeta): boolean => {
  // Loop through array elements and check for type match
  for (const element of value) {
    if (!isPrimitive(element) && element !== pickValue(element, meta)) {
      return false;
    }
  }

  return true;
};

/**
 * Clone source array
 */
const pickArray = (value: any[], meta: ArrayTypeGuardMeta): any[] => {
  // Check if the same value should be returned
  if (meta.same || arrayMatchesType(value, meta.child)) {
    return value;
  }

  return value.map((element) => pickValue(element, meta.child));
};

/**
 * Clone source value based on the provided intersection type
 */
const pickIntersection = (source: any, metas: TypeGuardMeta[]): any => {
  // Check for object value to assign its shape
  if (typeof source === 'object') {
    /** @type {any} */
    const initial = {};

    return metas.reduce(
      (result, meta) => ({
        ...result,
        ...pickValue(source, meta),
      }),
      initial
    );
  }

  return source;
};

/**
 * Check that the provided object matches the provided type
 */
const objectMatchesType = (
  value: Record<string, any>,
  meta: ObjectTypeGuardMeta
): boolean => {
  for (const key in value) {
    if (!meta.keys.includes(key)) {
      return false;
    }

    const prop = value[key];

    if (!isPrimitive(prop)) {
      const entry = [...meta.required, ...meta.optional].find(
        ([entryKey]) => entryKey === key
      );

      if (entry && prop !== pickValue(prop, getTypeGuardMeta(entry[1]))) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Clone source object
 */
const pickObject = (
  value: Record<string, any>,
  meta: ObjectTypeGuardMeta
): Record<string, any> => {
  // Check if the same value should be returned
  if (meta.same || objectMatchesType(value, meta)) {
    return value;
  }

  const result: any = {};

  for (const [key, type] of [...meta.required, ...meta.optional]) {
    // Check for primitive values
    if (isPrimitive(value[key])) {
      result[key] = value[key];
    } else {
      result[key] = pickValue(value[key], getTypeGuardMeta(type));
    }
  }

  return result;
};

/**
 * Check that provided tuple matches the provided type
 */
const tupleMatchesType = (value: any[], meta: TupleTypeGuardMeta): boolean => {
  const { indexes, tuple } = meta;
  const { required, rest } = indexes;

  // Check for empty tuple value
  if (value.length === 0) {
    return true;
  }

  return value.every((element, index) => {
    // Check for primitive elements
    if (isPrimitive(element)) {
      return true;
    }

    // Check for rest elements
    if (rest >= 0 && index >= rest) {
      // Check for required elements after rest
      if (required > rest && index > value.length - tuple.length + rest) {
        const type = tuple[tuple.length + index - value.length];

        return type && element === pickValue(element, getTypeGuardMeta(type));
      }

      const type = tuple[rest];

      /* istanbul ignore else */
      if (type) {
        const child = getTypeGuardMeta(type);

        /* istanbul ignore else */
        if (child.classification === 'rest') {
          return element === pickValue(element, getTypeGuardMeta(child.type));
        }
      }

      /* istanbul ignore next */
      throw TypeError('Invalid tuple type');
    }

    const type = tuple[index];

    return type && element === pickValue(element, getTypeGuardMeta(type));
  });
};

/**
 * Clone source tuple
 */
const pickTuple = (value: any[], meta: TupleTypeGuardMeta): any[] => {
  // Check if the same value should be returned
  if (meta.same || tupleMatchesType(value, meta)) {
    return value;
  }

  const { indexes, tuple } = meta;
  const { required, rest } = indexes;

  return value.map((element, index) => {
    // Check for primitive elements
    if (isPrimitive(element)) {
      return element;
    }

    // Check for rest elements
    if (rest >= 0 && index >= rest) {
      // Check for required elements after rest
      if (required > rest && index > value.length - tuple.length + rest) {
        const type = tuple[tuple.length + index - value.length];

        return type && pickValue(element, getTypeGuardMeta(type));
      }

      const type = tuple[rest];

      /* istanbul ignore next */
      if (!type) {
        throw TypeError('Invalid tuple type');
      }

      const child = getTypeGuardMeta(type);

      /* istanbul ignore else */
      if (child.classification === 'rest') {
        return pickValue(element, getTypeGuardMeta(child.type));
      }

      /* istanbul ignore next */
      throw TypeError('Invalid tuple type');
    }

    const type = tuple[index];

    /* istanbul ignore next */
    if (!type) {
      throw TypeError('Invalid tuple type');
    }

    return pickValue(element, getTypeGuardMeta(type));
  });
};

/**
 * Clone source value based on the provided union type
 */
const pickUnion = (value: any, union: Union): any => {
  // Loop through union types to pick the first one that matches
  for (const type of union) {
    /* istanbul ignore else */
    if (type(value)) {
      return pickValue(value, getTypeGuardMeta(type));
    }
  }

  /* istanbul ignore next */
  throw TypeError(invalidUnionType);
};

/**
 * Clone provided value based on its type
 */
export const pickValue = (value: any, meta: TypeGuardMeta): any => {
  // Check for primitive value to return the value unchanged
  if (isPrimitive(value)) {
    return value;
  }

  // Switch on type classification
  switch (meta.classification) {
    case 'array': {
      return pickArray(value, meta);
    }

    case 'function': {
      // @ts-expect-error TODO: Fix this
      return wrapFunction(value, meta.input, meta.output);
    }

    case 'intersection': {
      return pickIntersection(value, meta.children);
    }

    case 'object': {
      return pickObject(value, meta);
    }

    case 'tuple': {
      return pickTuple(value, meta);
    }

    case 'union': {
      return pickUnion(value, meta.union);
    }

    default: {
      return value;
    }
  }
};

/**
 * Clone provided value and transform it if refine function is provided
 */
export const refineValue = <T>(
  value: T,
  type: TypeGuard<T>,
  refine: (value: T) => T
): T => {
  const result = refine(value);

  // Check the result of the refine function call
  if (type(result)) {
    return result;
  }

  throw invalidRefineValue(type, value);
};

/**
 * Optimize data getting based on its type classification
 */
export const takeValue = (value: any, meta: TypeGuardMeta): any => {
  // Switch on type classification
  switch (meta.classification) {
    case 'any':
    case 'instance':
    case 'literal':
    case 'literals':
    case 'primitive':
    case 'template-literal': {
      return value;
    }

    default: {
      return pickValue(value, meta);
    }
  }
};
