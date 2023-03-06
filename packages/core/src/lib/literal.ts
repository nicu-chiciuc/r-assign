import { InferLiterals, Literal, Literals, TypeGuard } from '.';
import {
  hasAtLeastOneElement,
  hasOneElement,
  includes,
} from './internal/array-checks';
import { invalidLiteral, invalidLiterals } from './internal/errors';
import { setTypeGuardMeta } from './internal/type-guard-meta';

const { isArray } = Array;
const { isFinite } = Number;

const duplicateLiteral = 'Duplicate literal provided';
const notEnoughLiterals = 'Not enough literals, at least one expected';

/**
 * Get literal annotation
 */
const getLiteralAnnotation = <L extends Literal>(literal: L): string => {
  // Switch on literal type
  switch (typeof literal) {
    case 'bigint': {
      return `${literal}n`;
    }

    case 'string': {
      return `"${literal}"`;
    }

    default: {
      return String(literal);
    }
  }
};

/**
 * Get literals annotation
 */
const getLiteralsAnnotation = <L extends Literal>(literals: L[]): string =>
  literals.map(getLiteralAnnotation).join(' | ');

/**
 * Validate provided literal
 */
const validateLiteral = (literal: any, index?: number, literals?: any[]) => {
  const type = typeof literal;

  // Check for invalid literal types
  if (
    (type === 'object' && literal !== null) ||
    (type === 'number' && !isFinite(literal)) ||
    type === 'function' ||
    type === 'symbol'
  ) {
    throw TypeError(invalidLiteral);
  }

  // Check for duplicate literals
  if (literals && literals.indexOf(literal) !== index) {
    throw TypeError(duplicateLiteral);
  }
};

/**
 * Check for literal values
 */
function isLiteral<L extends Literal>(literal: L): TypeGuard<L> {
  // Validate provided literal
  validateLiteral(literal);

  const annotation = getLiteralAnnotation(literal);

  const check: TypeGuard<L> = (value: unknown): value is L => value === literal;

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    classification: 'literal',
    description: `${annotation} literal`,
    literal,
  });

  return check;
}

/**
 * Check for union of literal values
 */
function isLiteralOf<L extends Literal, T extends Literals<L>>(
  literals: T
): TypeGuard<InferLiterals<L, T>> {
  // Check for valid literals provided
  if (!isArray(literals)) {
    throw TypeError(invalidLiterals);
  }

  // Check for at least one literal provided
  if (!hasAtLeastOneElement(literals)) {
    throw TypeError(notEnoughLiterals);
  }

  // Check for one literal
  if (hasOneElement(literals)) {
    const check: TypeGuard = isLiteral(literals[0]);

    return check;
  }

  // Sort and validate each literal
  literals.slice(0).sort().forEach(validateLiteral);

  const annotation = getLiteralsAnnotation(literals);

  const check: TypeGuard<InferLiterals<L, T>> = (
    value: unknown
  ): value is InferLiterals<L, T> => includes(literals, value);

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    classification: 'literals',
    description: `a union of literals ${annotation}`,
    literals,
  });

  return check;
}

export {
  isLiteral,
  isLiteralOf,
  isLiteral as literal,
  isLiteralOf as literals,
};
