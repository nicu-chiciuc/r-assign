/**
 * Check if the array has at least one element
 */
export const hasAtLeastOneElement = <T>(array: T[]): array is [T, ...T[]] =>
  array.length > 0;

/**
 * Wrapper around `Array.includes()` that is also a type guard and doesn't err if the value
 * is not guaranteed to be in the given array
 *
 * @param arr
 * @param value
 */
export function includes<T>(arr: T[], value: unknown): value is T {
  // @ts-ignore
  return arr.includes(value);
}

/**
 * Check if the array has at least two elements
 */
export const hasAtLeastTwoElements = <T>(array: T[]): array is [T, T, ...T[]] =>
  array.length > 1;

/**
 * Check if the array has one element
 */
export const hasOneElement = <T>(array: T[]): array is [T] =>
  array.length === 1;

/**
 * Check if the array has two elements
 */
export const hasTwoElements = <T>(array: T[]): array is [T, T] =>
  array.length === 2;
