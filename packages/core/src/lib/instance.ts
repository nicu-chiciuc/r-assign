'use strict';

import {
  Constructor,
  TypeGuard,
  InferConstructor,
  getType,
  parseType,
} from '.';
import { TransformFunction } from '.';
import { invalidConstructor } from './internal/errors';
import { setTypeGuardMeta } from './internal/type-guard-meta';

/**
 * Check for instance values
 */
function isInstanceOf<C extends Constructor>(
  constructor: C
): TypeGuard<InferConstructor<C>> {
  // Check for valid type guard
  if (typeof constructor !== 'function') {
    throw TypeError(invalidConstructor);
  }

  const check: TypeGuard<InferConstructor<C>> = (
    value: unknown
  ): value is InferConstructor<C> => value instanceof constructor;

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation: constructor.name,
    classification: 'instance',
    constructor,
    description: `an instance of ${constructor.name}`,
  });

  return check;
}

/**
 * Extract instance values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
function getInstanceOf<C extends Constructor>(
  instance: C,
  initial: InferConstructor<C>
): TransformFunction<InferConstructor<C>> {
  return getType(isInstanceOf(instance), initial);
}

/**
 * Extract and validate instance values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
function parseInstanceOf<C extends Constructor>(
  instance: C
): TransformFunction<InferConstructor<C>> {
  return parseType(isInstanceOf(instance));
}

export {
  getInstanceOf,
  isInstanceOf as instance,
  isInstanceOf,
  parseInstanceOf,
};
