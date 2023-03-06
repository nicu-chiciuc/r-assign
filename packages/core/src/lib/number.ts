import { TypeGuard } from '.';
import { setTypeGuardMeta } from './internal/type-guard-meta';

const { isFinite } = Number;

/**
 * Check for number values
 * @deprecated will be removed in version 2.0
 */
const isAnyNumber: TypeGuard<number> = (value: unknown): value is number =>
  typeof value === 'number';

// Save type guard meta
setTypeGuardMeta(isAnyNumber, {
  annotation: 'number',
  classification: 'primitive',
  description: 'a number value',
  finite: false,
  primitive: 'number',
});

/**
 * Check for finite number values
 */
const isNumber: TypeGuard<number> = (value: unknown): value is number =>
  isAnyNumber(value) && isFinite(value);

// Save type guard meta
setTypeGuardMeta(isNumber, {
  annotation: 'number',
  classification: 'primitive',
  description: 'a finite number value',
  finite: true,
  primitive: 'number',
});

export { isAnyNumber as anyNumber, isAnyNumber, isNumber, isNumber as number };
