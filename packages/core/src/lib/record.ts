import { InferTypeGuard, Shape, TypeGuard } from '.';
import { hasOneElement, hasAtLeastTwoElements } from './internal/array-checks';
import { invalidOptionalType } from './internal/invalid-type';
import {
  getTypeGuardMeta,
  isKeyTypeGuard,
  setTypeGuardMeta,
} from './internal/type-guard-meta';
import { isObjectOf, isStrictObjectOf } from './object';
import { isString } from './string';
import { isUnionOf } from './union';

const { getOwnPropertyNames, getOwnPropertySymbols } = Object;

const noArgs = 'No arguments provided for record type, at least one expected';

/**
 * Check for reducible record
 */
const canReduceKeys = <K extends TypeGuard<keyof any>>(
  keys: K
  // @ts-expect-error TODO: fix this
): keys is TypeGuard<string | number | symbol> => {
  const meta = getTypeGuardMeta(keys);

  switch (meta.classification) {
    case 'literal':
    case 'literals': {
      return true;
    }

    case 'union': {
      return meta.union.some(canReduceKeys);
    }

    default: {
      return false;
    }
  }
};

/**
 * Reduce record keys
 */
const reduceKeys = (keys: TypeGuard<keyof any>): (TypeGuard | string)[] => {
  const meta = getTypeGuardMeta(keys);

  switch (meta.classification) {
    case 'literal': {
      return [String(meta.literal)];
    }

    case 'literals': {
      return meta.literals.map(String);
    }

    case 'union': {
      return meta.union.flatMap(reduceKeys);
    }

    default: {
      return [keys];
    }
  }
};

/**
 * Reduce record to object
 */
const reduceRecord = <
  K extends TypeGuard<string | number | symbol>,
  V extends TypeGuard
>(
  keys: K,
  values: V
): TypeGuard => {
  const mapping: TypeGuard[] = [];
  const shape: Shape = {};

  // Add the reduced keys to the shape
  reduceKeys(keys).forEach((key) => {
    if (typeof key === 'string') {
      shape[key] = values;
    } else {
      mapping.push(key);
    }
  });

  // Reduce to object with mapping
  if (hasOneElement(mapping)) {
    return isObjectOf(shape, isRecordOf(mapping[0], values));
  }

  // Reduce to object with union mapping
  if (hasAtLeastTwoElements(mapping)) {
    return isObjectOf(shape, isRecordOf(isUnionOf(mapping), values));
  }

  return isStrictObjectOf(shape);
};

/**
 * Get record values annotation
 */
const getRecordMemberAnnotation = (type: TypeGuard): string => {
  const { annotation, classification } = getTypeGuardMeta(type);

  // Check for optional type
  if (classification === 'optional') {
    throw TypeError(invalidOptionalType('record'));
  }

  return annotation;
};

/**
 * Get record annotation based on keys and values type guards
 */
const getRecordAnnotation = (keys: TypeGuard, values: TypeGuard): string => {
  return `Record<${getRecordMemberAnnotation(
    keys
  )}, ${getRecordMemberAnnotation(values)}>`;
};

/**
 * Prepare arguments for record creation
 */
const getRecordArgs = <K extends TypeGuard<keyof any>, V extends TypeGuard>(
  args: [K, V] | [V]
): [K | TypeGuard<string>, V] => {
  // Check for only values type guard provided
  if (hasOneElement(args)) {
    return [isString, args[0]];
  }

  // Check for keys and values type guards provided
  if (hasAtLeastTwoElements(args)) {
    return [args[0], args[1]];
  }

  throw TypeError(noArgs);
};

/**
 * Check for number keys in record
 */
const hasNumberKeys = <N extends number>(
  keys: TypeGuard<keyof any>
): keys is TypeGuard<N> => {
  const meta = getTypeGuardMeta(keys);

  // Switch on type classification
  switch (meta.classification) {
    case 'primitive': {
      return meta.primitive === 'number';
    }

    case 'union': {
      return meta.union.some(hasNumberKeys);
    }

    default: {
      return false;
    }
  }
};

/**
 * Check for tuple values
 */
const isRecordOf = <K extends TypeGuard<keyof any>, V extends TypeGuard>(
  ...args: [K, V] | [V]
): TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>> => {
  // TODO: Fix this
  let [keys, values]: [any, any] = getRecordArgs(args);

  // Validate keys type
  if (!isKeyTypeGuard(keys)) {
    throw TypeError('Invalid type guard for record keys');
  }

  // Check if record can be reduced to an object shape
  if (canReduceKeys(keys)) {
    return reduceRecord(keys, values);
  }

  // TODO: fix this
  keys = keys as any;

  const annotation = getRecordAnnotation(keys, values);
  const tryNumber = hasNumberKeys(keys);

  const check: TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>> = (
    value: any
  ): value is Record<InferTypeGuard<K>, InferTypeGuard<V>> => {
    // Check for non-object values
    if (value === null || typeof value !== 'object') {
      return false;
    }

    const properties = [
      ...getOwnPropertyNames(value),
      ...getOwnPropertySymbols(value),
    ];

    // Check every string and symbol key
    for (const key of properties) {
      // Check key type
      if (typeof key === 'string') {
        if (!((tryNumber && keys(Number(key))) || keys(key))) {
          return false;
        }
      } else if (!keys(key)) {
        return false;
      }

      // Check property type
      if (!values(value[key])) {
        return false;
      }
    }

    return true;
  };

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    classification: 'record',
    description: `a record of ${annotation}`,
    keys,
    same: false,
    values,
  });

  return check;
};

export { isRecordOf, isRecordOf as record };
