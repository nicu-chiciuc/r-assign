import { InferFunction, TypeGuard } from '..';
import {
  invalidFunctionArguments,
  invalidFunctionReturn,
  invalidFunctionVoidReturn,
} from './invalid-type';

/**
 * Get function annotation
 */
export const wrapFunction = <A extends TypeGuard, R extends TypeGuard>(
  fn: (...args: any[]) => any,
  args: A,
  result: R
  // @ts-expect-error TODO: Fix this
): InferFunction<A, R> => {
  return (...input) => {
    // Check for valid function arguments
    if (!args(input)) {
      throw TypeError(invalidFunctionArguments(args, input));
    }

    const output = fn(...input);

    // Check for valid function return in case return type is provided
    if (result && !result(output)) {
      throw TypeError(invalidFunctionReturn(result, output));
    }

    // Check for valid function return in case return type is void
    if (!result && output !== undefined) {
      throw TypeError(invalidFunctionVoidReturn(output));
    }

    return output;
  };
};
