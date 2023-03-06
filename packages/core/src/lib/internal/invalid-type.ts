import { TypeClassification } from '.';
import { TypeGuard } from '..';
import { hasOneElement } from './array-checks';
import { getTypeGuardMeta } from './type-guard-meta';

const { isArray } = Array;
const { isFinite } = Number;
const { entries, getPrototypeOf, keys } = Object;

/**
 * Get the prototype constructor of the provided value
 */
const getConstructor = (value: unknown): Function | null => {
  const prototype = getPrototypeOf(value);

  // Check for available prototype and constructor
  if (prototype && prototype.constructor) {
    return prototype.constructor;
  }

  return null;
};

/**
 * Check for non-finite number
 */
const isNonFiniteNumber = (value: any): value is number =>
  typeof value === 'number' && !isFinite(value);

/**
 * Check for a primitive value
 */
const isPrimitive = (kind: string): boolean =>
  kind !== 'object' && kind !== 'function';

/**
 * Pop the last element from the stack and return its stringified value
 */
const getEntry = (stack: any[], entry: string): string => {
  // Remove last element from the stack
  stack.pop();

  return entry;
};

/**
 * Stringify a value type and push it to the stack
 */
const stringifyPart = (stack: any[], value: any): string => {
  // Check for circular reference
  if (stack.includes(value)) {
    return getEntry(stack, '<Circular Reference>');
  }

  // Add the value to the stack
  stack.push(value);

  // Check for null
  if (value === null) {
    return getEntry(stack, 'null');
  }

  // Check for arrays
  if (isArray(value)) {
    // Check for empty arrays
    if (value.length === 0) {
      return getEntry(stack, '[]');
    }

    const types: string[] = [];

    // Loop through the array elements
    for (const element of value) {
      const type = stringifyPart(stack, element);

      // Check for unique type
      if (!types.includes(type)) {
        types.push(type);
      }
    }

    // Check for array with elements of one type
    if (hasOneElement(types)) {
      return getEntry(stack, `${types[0]}[]`);
    }

    return getEntry(stack, `(${types.join(' | ')})[]`);
  }

  const kind = typeof value;

  // Check for objects
  if (kind === 'object') {
    const constructor = getConstructor(value);

    // Check for objects with constructors
    if (constructor) {
      // Check for Object constructor
      if (constructor === Object) {
        // Check for empty objects
        if (keys(value).length === 0) {
          return getEntry(stack, '{}');
        }

        const indent = ' '.repeat(stack.length - 1);

        return getEntry(
          stack,
          `${indent}{\n${entries(value)
            .map(([key, element]) => {
              return `${indent} "${key}": ${stringifyPart(stack, element)};`;
            })
            .join('\n')}\n${indent}}`
        );
      }

      return getEntry(stack, constructor.name);
    }

    return getEntry(stack, Object.name);
  }

  // Check for functions
  if (kind === 'function') {
    return getEntry(stack, Function.name);
  }

  return getEntry(stack, kind);
};

/**
 * Stringify any type
 */
const stringifyValue = (value: any): string => stringifyPart([], value);

/**
 * Stringify the content of a tuple
 */
const stringifyTuple = (value: any[]): string => {
  // Check for empty tuple
  if (value.length === 0) {
    return 'an empty tuple []';
  }

  return `a tuple of [ ${value.map(stringifyValue).join(', ')} ]`;
};

/**
 * Received type message
 */
const receivedType = (
  value: any,
  classification: TypeClassification
): string => {
  const message = 'but received';
  const kind = typeof value;

  // Check for template literal and string values
  if (classification === 'template-literal' && kind === 'string') {
    return `${message} "${value}"`;
  }

  // Check for literals, null, undefined and non-finite numbers
  if (
    value === null ||
    value === undefined ||
    isNonFiniteNumber(value) ||
    (classification === 'literal' && isPrimitive(kind))
  ) {
    // Check for string literals
    if (kind === 'string') {
      return `${message} "${value}"`;
    }

    return `${message} ${String(value)}`;
  }

  const constructor = getConstructor(value);

  // Check for object instances
  if (
    kind === 'object' &&
    constructor &&
    constructor !== Object &&
    constructor !== Array
  ) {
    return `${message} an instance of ${constructor.name}`;
  }

  // Check for array value
  if (isArray(value)) {
    // Check for tuple expectation
    if (classification === 'tuple') {
      return `${message} ${stringifyTuple(value)}`;
    }

    // Check for empty array
    if (value.length === 0) {
      return `${message} an empty array []`;
    }
  }

  return `${message} a value of type ${stringifyValue(value)}`;
};

/**
 * Message for invalid property type error
 */
const invalidType = (context: string, type: TypeGuard, value: any): string => {
  const { classification, description } = getTypeGuardMeta(type);

  return `${context}, expected ${description} ${receivedType(
    value,
    classification
  )}`;
};

/**
 * Message for invalid function arguments error
 */
export const invalidFunctionArguments = (type: TypeGuard, value: any): string =>
  invalidType('Invalid function arguments', type, value);

/**
 * Message for invalid function return error
 */
export const invalidFunctionReturn = (type: TypeGuard, value: any): string =>
  invalidType('Invalid function return', type, value);

/**
 * Message for invalid function return error
 */
export const invalidFunctionVoidReturn = (value: any): string =>
  `Invalid function return, expected void ${receivedType(value, 'function')}`;

/**
 * Message for invalid initial value type error
 */
export const invalidInitialValue = (type: TypeGuard, value: any): string =>
  invalidType('Invalid default value type', type, value);

/**
 * Message for invalid value after refine
 */
export const invalidRefineValue = (type: TypeGuard, value: any): string =>
  invalidType('Invalid refine value type', type, value);

/**
 * Message for invalid optional type
 */
export const invalidOptionalType = (context: string): string =>
  `Optional type cannot be used in ${context} declaration`;

/**
 * Message for available property name
 */
const withKey = (key?: string): string => {
  // Check for provided key
  if (typeof key === 'string') {
    return ` for property "${key}"`;
  }

  return '';
};

/**
 * Message for invalid value type error
 */
export const invalidValue = (
  type: TypeGuard,
  value: any,
  key?: string
): string => invalidType(`Invalid value type${withKey(key)}`, type, value);
