import { TypeGuard } from '.';
import { TransformFunction } from '.';
import { getType } from './get-type';
import { setTypeGuardMeta } from './internal/type-guard-meta';
import { parseType } from './parse-type';

/**
 * Check for symbol values
 */
const isSymbol: TypeGuard<symbol> = (value: unknown): value is symbol =>
  typeof value === 'symbol';

// Save type guard meta
setTypeGuardMeta(isSymbol, {
  annotation: 'symbol',
  classification: 'primitive',
  description: 'a symbol value',
  primitive: 'symbol',
});

/**
 * Extract symbol values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
const getSymbol = (initial = Symbol()): TransformFunction<symbol> =>
  getType(isSymbol, initial);

/**
 * Extract and validate symbol values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
const parseSymbol: TransformFunction<symbol> = parseType(isSymbol);

export { getSymbol, isSymbol, parseSymbol, isSymbol as symbol };
