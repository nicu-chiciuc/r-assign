import { setTypeGuardMeta } from './internal/type-guard-meta';

const { isNaN } = Number;

/**
 * Check for date values
 * @deprecated will be removed in version 2.0
 */
const isAnyDate = (value: unknown): value is Date => value instanceof Date;

// Save type guard meta
// @ts-expect-error TODO: fix type guard meta
setTypeGuardMeta(isAnyDate, {
  annotation: 'Date',
  classification: 'instance',
  constructor: Date,
  description: 'an instance of Date',
});

/**
 * Check for valid date values
 */
const isDate = (value: unknown): value is Date =>
  isAnyDate(value) && !isNaN(value.getTime());

// Save type guard meta
// @ts-expect-error TODO: fix this
setTypeGuardMeta(isDate, {
  annotation: 'Date',
  classification: 'instance',
  constructor: Date,
  description: 'an instance of valid Date',
});

export { isAnyDate as anyDate, isDate as date, isAnyDate, isDate };
