import { BaseTypeGuard, InferFunction, Tuple, TypeGuard } from '.';
import {
  getTypeGuardMeta,
  assertBaseTypeGuard,
  setTypeGuardMeta,
} from './internal/type-guard-meta';
import { isTupleOf } from './tuple';

/**
 * Get input annotation
 */
const getInputAnnotation = <I extends TypeGuard>(input: I): string => {
  const meta = getTypeGuardMeta(input);

  // Switch on input classification
  switch (meta.classification) {
    case 'array': {
      return `...args: ${meta.annotation}`;
    }

    case 'tuple': {
      // Check for empty tuple
      if (meta.tuple.length === 0) {
        return '';
      }

      const { required, rest } = meta.indexes;

      // Check for required arguments after rest
      if (rest >= 0 && required > rest) {
        return `...args: ${meta.annotation}`;
      }

      return meta.tuple
        .map((type, index) => {
          const { annotation, classification } = getTypeGuardMeta(type);

          // Check for optional type
          if (classification === 'optional') {
            return `arg_${index}?: ${annotation}`;
          }

          return `arg_${index}: ${annotation}`;
        })
        .join(', ');
    }

    /* istanbul ignore next */
    default: {
      throw TypeError('Invalid function arguments');
    }
  }
};

/**
 * Get output annotation
 */
const getOutputAnnotation = <O extends TypeGuard>(output: O): string => {
  // Check for non-void output
  if (output) {
    const { annotation, classification } = getTypeGuardMeta(output);

    // Assert for base type guard
    assertBaseTypeGuard(classification);

    return annotation;
  }

  return 'void';
};

/**
 * Get function annotation
 */
const getFunctionAnnotation = <I extends TypeGuard, O extends TypeGuard>(
  input: I,
  output: O
): string => {
  return `(${getInputAnnotation(input)}) => ${getOutputAnnotation(output)}`;
};

/**
 * Check for function values
 */
function isFunction<T extends Tuple, R extends TypeGuard = TypeGuard<void>>(
  input: T,
  output?: BaseTypeGuard<R>
): TypeGuard<InferFunction<T, R>> {
  const isInput = isTupleOf(input);
  // @ts-expect-error TODO: fix
  const annotation = getFunctionAnnotation(isInput, output);

  const check: TypeGuard<InferFunction<T, R>> = (
    value: unknown
  ): value is InferFunction<T, R> => typeof value === 'function';

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    classification: 'function',
    description: `a function ${annotation}`,
    input: isInput,
    output,
  });

  return check;
}

export { isFunction as func, isFunction };
