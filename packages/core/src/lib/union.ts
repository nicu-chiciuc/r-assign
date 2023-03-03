import { InferUnion, Literal, TypeGuard, Union } from '.';
import { TransformFunction } from '.';
import { isAny } from './any';
import { getType } from './get-type';
import {
  hasOneElement,
  hasAtLeastTwoElements,
  hasTwoElements,
} from './internal/array-checks';
import { invalidOptionalType } from './internal/invalid-type';
import {
  getTypeGuardMeta,
  isStringTypeGuard,
  isAnyTypeGuard,
  setTypeGuardMeta,
} from './internal/type-guard-meta';
import { isLiteralOf, isLiteral } from './literal';
import { parseType } from './parse-type';

const { isArray } = Array;
const { values } = Object;

const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

/**
 * Get union annotation
 */
const getUnionAnnotation = (union: TypeGuard[]): string => {
  const annotations: string[] = [];

  // Loop over all type guards
  for (const type of union) {
    const { annotation } = getTypeGuardMeta(type);

    // Add annotation to the list if it is not already in the list
    if (!annotations.includes(annotation)) {
      annotations.push(annotation);
    }
  }

  // Return the annotation for just one type
  if (hasOneElement(annotations)) {
    return annotations[0];
  }

  return annotations.join(' | ');
};

/**
 * Check for literal primitive in the union type
 */
const findLiteralPrimitive = (
  union: TypeGuard[],
  literal: Literal
): boolean => {
  return union.some((type) => {
    const meta = getTypeGuardMeta(type);

    return (
      meta.classification === 'primitive' && typeof literal === meta.primitive
    );
  });
};

/**
 * Find literal in other members of the union
 */
const findLiteralUnion = (union: TypeGuard[], literal: Literal): boolean => {
  return union.some((type) => {
    const meta = getTypeGuardMeta(type);

    return (
      meta.classification === 'literals' && meta.literals.includes(literal)
    );
  });
};

/**
 * Unwrap an filter union types
 */
const mapUnion = (
  type: TypeGuard,
  index: number,
  union: TypeGuard[]
): TypeGuard | TypeGuard[] => {
  // Filter repeated type guards
  if (union.indexOf(type) !== index) {
    return [];
  }

  const meta = getTypeGuardMeta(type);

  // Switch on type classification
  switch (meta.classification) {
    case 'literal': {
      // Check for literal primitive to filter out the literal
      if (findLiteralPrimitive(union, meta.literal)) {
        return [];
      }

      // Check for literal union to filter out the literal
      if (findLiteralUnion(union, meta.literal)) {
        return [];
      }

      return type;
    }

    case 'literals': {
      const literals = meta.literals.flatMap((literal) => {
        // Check for literals that can be reduced
        if (findLiteralPrimitive(union, literal)) {
          return [];
        }

        return literal;
      });

      // Check if literals changed
      if (literals.length === meta.literals.length) {
        return type;
      }

      // Check for a new set of literals
      if (hasAtLeastTwoElements(literals)) {
        return isLiteralOf(literals);
      }

      // Check for only one literal
      if (hasOneElement(literals)) {
        return isLiteral(literals[0]);
      }

      return [];
    }

    case 'optional': {
      throw TypeError(invalidOptionalType('union'));
    }

    case 'template-literal': {
      // Check for string primitive to filter out the template literal
      if (union.some(isStringTypeGuard)) {
        return [];
      }

      return type;
    }

    case 'union': {
      return meta.union;
    }

    default: {
      return type;
    }
  }
};

/**
 * Create union type guard
 */
const getUnionTypeGuard = <U extends Union>(
  union: U
): TypeGuard<InferUnion<U>> => {
  // Check for exactly two type guards union
  if (hasTwoElements(union)) {
    const [first, second] = union;

    const check: TypeGuard<InferUnion<U>> = (
      value: unknown
    ): value is InferUnion<U> => first(value) || second(value);

    return check;
  }

  const check: TypeGuard<InferUnion<U>> = (
    value: unknown
  ): value is InferUnion<U> => {
    // Check for at least one element to match type
    for (const type of union) {
      if (type(value)) {
        return true;
      }
    }

    return false;
  };

  return check;
};

/**
 * Check for union type values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
const isUnionOf = <U extends Union>(types: U): TypeGuard<InferUnion<U>> => {
  // Check for valid type guards provided
  if (!isArray(types)) {
    throw TypeError(invalidTypeGuards);
  }

  // Check for less than two type guards
  if (!hasAtLeastTwoElements(types)) {
    throw TypeError(notEnoughTypeGuards);
  }

  const union = values(types).flatMap(mapUnion);

  // Check for any type guard in the union
  if (union.some(isAnyTypeGuard)) {
    return isAny;
  }

  // Check again for enough type guards after union reduction
  if (!hasAtLeastTwoElements(union)) {
    // Check for one type guard
    if (hasOneElement(union)) {
      return union[0];
    }

    throw TypeError(notEnoughTypeGuards);
  }

  const annotation = getUnionAnnotation(union);
  const check = getUnionTypeGuard(union);

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    children: union.map(getTypeGuardMeta),
    classification: 'union',
    description: `an union of ${annotation}`,
    union,
  });

  return check;
};

/**
 * Extract union type values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
const getUnionOf = <U extends Union>(
  union: U,
  initial: InferUnion<U>
): TransformFunction<InferUnion<U>> => getType(isUnionOf(union), initial);

/**
 * Extract and validate union type values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
const parseUnionOf = <U extends Union>(
  union: U
): TransformFunction<InferUnion<U>> => parseType(isUnionOf(union));

export { getUnionOf, isUnionOf, parseUnionOf, isUnionOf as union };
