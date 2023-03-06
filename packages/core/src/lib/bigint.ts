import { TypeGuard } from '.';
import { setTypeGuardMeta } from './internal/type-guard-meta';

/**
 * Check for BigInt values
 */
const isBigInt: TypeGuard<bigint> = (value: unknown): value is bigint =>
  typeof value === 'bigint';

// Save type guard meta
setTypeGuardMeta(isBigInt, {
  annotation: 'bigint',
  classification: 'primitive',
  description: 'a BigInt value',
  primitive: 'bigint',
});

export { isBigInt as bigint, isBigInt };
