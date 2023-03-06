import { AnyTag, AnyTypeGuard, TypeGuard } from '.';
import { setTypeGuardMeta } from './internal/type-guard-meta';

const { assign } = Object;

const anyTag: AnyTag = { any: true };

const guard: TypeGuard = (value: unknown): value is any => true;

/**
 * Check for any values
 */
const isAny: AnyTypeGuard = assign(guard, anyTag);

// Save type guard meta
setTypeGuardMeta(isAny, {
  annotation: 'any',
  classification: 'any',
  description: 'any value',
});

export { isAny as any, isAny };
