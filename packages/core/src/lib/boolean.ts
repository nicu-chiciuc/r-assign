import { TransformFunction } from '.';
import { getType } from './get-type';
import { setTypeGuardMeta } from './internal/type-guard-meta';
import { parseType } from './parse-type';

/**
 * Check for boolean values
 */
const isBoolean = (value?: unknown): value is boolean =>
  typeof value === 'boolean';

// Save type guard meta
setTypeGuardMeta(isBoolean, {
  annotation: 'boolean',
  classification: 'primitive',
  description: 'a boolean value',
  primitive: 'boolean',
});

/**
 * Extract boolean values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
const getBoolean = (initial = false): TransformFunction<boolean> =>
  getType(isBoolean, initial);

/**
 * Extract and validate boolean values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
const parseBoolean: TransformFunction<boolean> = parseType(isBoolean);

export { isBoolean as boolean, isBoolean, getBoolean, parseBoolean };
