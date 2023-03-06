import { Constructor, InferConstructor, TypeGuard } from '.';
import { invalidConstructor } from './internal/errors';
import { setTypeGuardMeta } from './internal/type-guard-meta';

/**
 * Check for instance values
 */
function isInstanceOf<C extends Constructor>(
  constructor: C
): TypeGuard<InferConstructor<C>> {
  // Check for valid type guard
  if (typeof constructor !== 'function') {
    throw TypeError(invalidConstructor);
  }

  const check: TypeGuard<InferConstructor<C>> = (
    value: unknown
  ): value is InferConstructor<C> => value instanceof constructor;

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation: constructor.name,
    classification: 'instance',
    constructor,
    description: `an instance of ${constructor.name}`,
  });

  return check;
}

export { isInstanceOf as instance, isInstanceOf };
