import { TypeGuard } from '.';
import { getTypeGuardMeta, setTypeGuardMeta } from './internal/type-guard-meta';

const allowedTypes = 'are allowed only array, object, record or tuple types';
const invalidSetSame = `Invalid type for "setSame()", ${allowedTypes}`;

/**
 * Set same flag for the provided type guard
 */
function setSame<T extends TypeGuard<Record<keyof any, any> | any[]>>(
  type: T,
  same = false
): T {
  const meta = getTypeGuardMeta(type);

  // Switch on type classification
  switch (meta.classification) {
    case 'array':
    case 'object':
    case 'record':
    case 'tuple': {
      // Set same flag in type guard meta
      setTypeGuardMeta(type, {
        ...meta,
        same,
      });

      return type;
    }

    default: {
      throw TypeError(invalidSetSame);
    }
  }
}

export { setSame as same, setSame };
