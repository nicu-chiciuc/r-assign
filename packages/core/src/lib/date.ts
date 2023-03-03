import { TransformFunction } from '.';
import { invalidDate } from './internal/errors';
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
 * Transform number or string values to date
 * @deprecated will be removed in version 2.0
 */
const convertToAnyDate: TransformFunction<Date> = (value) => {
  // Check for string or number values
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }

  // Check for date values
  if (isAnyDate(value)) {
    return value;
  }

  throw TypeError(invalidDate);
};

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

/**
 * Transform number or string values to valid date
 * @deprecated will be removed in version 2.0, use `asDate()` instead
 */
const convertToDate = (value?: unknown): Date => {
  // Check for string or number values
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);

    // Check for valid date values
    if (isDate(date)) {
      return date;
    }

    throw TypeError(invalidDate);
  }

  // Check for date values
  if (isDate(value)) {
    return value;
  }

  throw TypeError(invalidDate);
};

export {
  isAnyDate as anyDate,
  convertToAnyDate as asAnyDate,
  convertToDate as asDate,
  convertToAnyDate,
  convertToDate,
  isDate as date,
  isAnyDate,
  isDate,
};
