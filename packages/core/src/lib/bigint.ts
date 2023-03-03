import { TypeGuard } from '.';
import { TransformFunction } from '.';
import { getType } from './get-type';
import { setTypeGuardMeta } from './internal/type-guard-meta';
import { parseType } from './parse-type';

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

/**
 * Extract BigInt values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
const getBigInt = (initial = 0n) => getType(isBigInt, initial);

/**
 * Extract and validate BigInt values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<bigint>}
 */
const parseBigInt: TransformFunction<bigint> = parseType(isBigInt);

export { isBigInt as bigint, getBigInt, isBigInt, parseBigInt };
