import { setTypeGuardMeta } from './internal/type-guard-meta';

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

export { isBoolean as boolean, isBoolean };
