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

/**
 * Extract any values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
function getAny(value?: unknown, key?: string, source?: unknown): any {
  return value;
}

/**
 * Extract and validate any values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction}
 */
const parseAny = getAny;

export { isAny as any, getAny, isAny, parseAny };
