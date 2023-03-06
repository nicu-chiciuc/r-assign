import { hasOneElement } from './lib/internal/array-checks';

const { assign, entries } = Object;

const invalidSchema = 'Invalid schema argument type, object expected';

type UndefinedKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

type OptionalObject<T> = Omit<T, UndefinedKeys<T>> &
  Partial<Pick<T, UndefinedKeys<T>>> extends infer R
  ? { [K in keyof R]: Exclude<R[K], undefined> }
  : never;

type TransformFunction<T = unknown> = (
  value?: unknown,
  key?: string,
  source?: unknown
) => T;

type TransformSchema<T = any> = {
  [key in keyof T]: TransformFunction<T[key]>;
};

type InferType<S extends TransformSchema> = OptionalObject<{
  [key in keyof S]: ReturnType<S[key]>;
}>;

/**
 * Extract one source object or merge an array of source objects
 */
const getSource = <S extends Record<string, any>>(sources: S[]): S => {
  // Check for one source object
  if (hasOneElement(sources) && typeof sources[0] === 'object') {
    return sources[0];
  }

  return assign({}, ...sources);
};

/**
 * Returns message for invalid schema property error
 */
const invalidSchemaProperty = (key: string): string => {
  return `Invalid property type, "${key}" property expected to be a function`;
};

/**
 * Assign object properties and transform result based on the provided schema
 */
export const rAssign = <S>(
  schema: TransformSchema<S>,
  ...sources: Record<string, unknown>[]
): InferType<TransformSchema<S>> => {
  // Check for valid schema provided
  if (typeof schema !== 'object' || schema === null) {
    throw TypeError(invalidSchema);
  }

  const source = getSource(sources);

  const result: any = {};

  // Populate result properties
  entries(schema).forEach(([key, transform]) => {
    // Check for valid schema properties
    if (typeof transform !== 'function') {
      throw TypeError(invalidSchemaProperty(key));
    }

    const value = transform(source[key], key, source);

    // Skip values that are undefined
    if (value !== undefined) {
      result[key] = value;
    }
  });

  return result;
};

export * from './lib';
