import { TypeGuard } from '.';
import { setTypeGuardMeta } from './internal/type-guard-meta';

/**
 * Check for undefined values
 */
const isUndefined: TypeGuard<undefined> = (
  value: unknown
): value is undefined => value === undefined;

// Save type guard meta
setTypeGuardMeta(isUndefined, {
  annotation: 'undefined',
  classification: 'literal',
  description: 'an undefined value',
  literal: undefined,
});

export { isUndefined, isUndefined as undef };
