import { TypeGuard } from '.';
import { setTypeGuardMeta } from './internal/type-guard-meta';

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

export { isString, isString as string };
