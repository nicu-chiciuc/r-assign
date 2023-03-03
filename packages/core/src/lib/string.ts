import { TypeGuard } from '.';
import { TransformFunction } from '.';
import { getType } from './get-type';
import { setTypeGuardMeta } from './internal/type-guard-meta';
import { parseType } from './parse-type';

/**
 * Check for string values
 */
const isString: TypeGuard<string> = (value: unknown): value is string =>
  typeof value === 'string';

// Save type guard meta
setTypeGuardMeta(isString, {
  annotation: 'string',
  classification: 'primitive',
  description: 'a string value',
  primitive: 'string',
});

/**
 * Transform any value to string
 * @deprecated will be removed in version 2.0, use "asString()" instead
 */
const convertToString: TransformFunction<string> = (value) => {
  // Check for string values
  if (isString(value)) {
    return value;
  }

  return String(value);
};

/**
 * Extract string values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
const getString = (initial = ''): TransformFunction<string> =>
  getType(isString, initial);

/**
 * Extract and validate string values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
const parseString: TransformFunction<string> = parseType(isString);

export {
  convertToString as asString,
  convertToString,
  getString,
  isString,
  parseString,
  isString as string,
};
