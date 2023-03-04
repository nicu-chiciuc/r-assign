import { TypeGuard } from '.';
import { setTypeGuardMeta } from './internal/type-guard-meta';

const isNever: TypeGuard<never> = (value: unknown): value is never => false;

// Save type guard meta
setTypeGuardMeta(isNever, {
  annotation: 'never',
  classification: 'never',
  description: 'never',
});

export { isNever, isNever as never };
