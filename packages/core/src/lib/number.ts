import { TypeGuard } from '.';
import { TransformFunction } from '.';
import { getType } from './get-type';
import { setTypeGuardMeta } from './internal/type-guard-meta';
import { parseType } from './parse-type';

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

/**
 * Extract number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
function getAnyNumber(initial = 0): TransformFunction<number> {
  return getType(isAnyNumber, initial);
}

/**
 * Extract finite number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
function getNumber(initial = 0): TransformFunction<number> {
  return getType(isNumber, initial);
}

/**
 * Extract and validate number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
const parseAnyNumber: TransformFunction<number> = parseType(isAnyNumber);

/**
 * Extract and validate finite number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
const parseNumber: TransformFunction<number> = parseType(isNumber);

export {
  isAnyNumber as anyNumber,
  getAnyNumber,
  getNumber,
  isAnyNumber,
  isNumber,
  isNumber as number,
  parseAnyNumber,
  parseNumber,
};
