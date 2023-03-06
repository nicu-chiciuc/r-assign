import { InferIntersection, Intersection, TypeGuard } from '.';
import { TransformFunction } from '.';
import { isAny } from './any';
import { getType } from './get-type';
import { hasTwoElements, hasAtLeastTwoElements } from './internal/array-checks';
import { invalidOptionalType } from './internal/invalid-type';
import {
  getTypeGuardMeta,
  isAnyTypeGuard,
  setTypeGuardMeta,
} from './internal/type-guard-meta';
import { parseType } from './parse-type';

const impossibleIntersection = 'Provided intersection is impossible';
const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

const { isArray } = Array;

/**
 * Get intersection annotation
 */
const getIntersectionAnnotation = <I extends Intersection>(
  intersection: I
): string => {
  const annotations: string[] = [];

  // Loop over all type guards
  for (const type of intersection) {
    const { annotation, classification } = getTypeGuardMeta(type);

    // Check for literal and primitive types
    if (classification === 'literal' || classification === 'primitive') {
      throw TypeError(impossibleIntersection);
    }

    // Check for optional type
    if (classification === 'optional') {
      throw TypeError(invalidOptionalType('intersection'));
    }

    // Add annotation to the list
    annotations.push(annotation);
  }

  return `(${annotations.join(' & ')})`;
};

/**
 * Create intersection type guard
 */
const getIntersectionTypeGuard = <I extends Intersection>(
  intersection: I
): TypeGuard<InferIntersection<I>> => {
  // Check for exactly two type guards union
  if (hasTwoElements(intersection)) {
    const [first, second] = intersection;

    const check: TypeGuard<InferIntersection<I>> = (
      value: unknown
    ): value is InferIntersection<I> => first(value) && second(value);

    return check;
  }

  const check: TypeGuard<InferIntersection<I>> = (
    value: unknown
  ): value is InferIntersection<I> => {
    // Check for at least one element to match type
    for (const type of intersection) {
      if (!type(value)) {
        return false;
      }
    }

    return true;
  };

  return check;
};

/**
 * Check for intersection type values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
function isIntersectionOf<I extends Intersection>(
  intersection: I
): TypeGuard<InferIntersection<I>> {
  // Check for valid types provided
  if (!isArray(intersection)) {
    throw TypeError(invalidTypeGuards);
  }

  // Check for less than two type guards
  if (!hasAtLeastTwoElements(intersection)) {
    throw TypeError(notEnoughTypeGuards);
  }

  // Check for any type guard in the intersection
  if (intersection.some(isAnyTypeGuard)) {
    return isAny;
  }

  const annotation = getIntersectionAnnotation(intersection);
  const check = getIntersectionTypeGuard(intersection);

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    children: intersection.map(getTypeGuardMeta),
    classification: 'intersection',
    description: `an intersection of ${annotation}`,
    types: intersection,
  });

  return check;
}

export { isIntersectionOf as intersection, isIntersectionOf };
