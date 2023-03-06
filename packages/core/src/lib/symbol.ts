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

export { isSymbol, isSymbol as symbol };
