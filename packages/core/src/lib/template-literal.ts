import { TypeGuard, Literal, InferTemplateLiteral, TemplateLiteral } from '.';
import {
  StringifiedTemplateLiteral,
  ReducibleTemplateLiteral,
} from './internal';
import { hasOneElement, hasAtLeastTwoElements } from './internal/array-checks';
import { invalidTemplateLiteral } from './internal/errors';
import { getTemplateLiteralREX } from './internal/get-type-rex';
import { invalidOptionalType } from './internal/invalid-type';
import {
  getTypeGuardMeta,
  isStringTypeGuard,
  setTypeGuardMeta,
} from './internal/type-guard-meta';
import { isLiteral, isLiteralOf } from './literal';
import { isString } from './string';

const { isArray } = Array;
const { values } = Object;

/**
 * Check if template literal part can be reduced to string literals
 */
const canReducePart = <L extends Literal, S extends string>(
  part: TypeGuard<L> | S
  // @ts-expect-error TODO: fix this
): part is TypeGuard<S> => {
  // Check for string parts
  if (typeof part === 'string') {
    return true;
  }

  const meta = getTypeGuardMeta(part);

  // Switch on type classification
  switch (meta.classification) {
    case 'literal':
    case 'literals': {
      return true;
    }

    case 'primitive': {
      return meta.primitive === 'boolean';
    }

    case 'union': {
      return meta.union.every(canReducePart);
    }

    default: {
      return false;
    }
  }
};

/**
 * Check if template literal can be reduced to string literals
 */
const canReduceTemplate = <
  L extends Literal,
  T extends StringifiedTemplateLiteral<L>,
  S extends string
>(
  template: T
  // @ts-expect-error TODO: fix this
): template is ReducibleTemplateLiteral<S> =>
  (hasOneElement(template) &&
    typeof template[0] === 'function' &&
    isStringTypeGuard(template[0])) ||
  template.every(canReducePart);

/**
 * Reduce template literal parts to string literals
 */
const reducePart = <S extends string>(
  result: string[],
  part: S | TypeGuard<S>
): string[] => {
  // Check for string parts
  if (typeof part === 'string') {
    return result.map((literal) => `${literal}${part}`);
  }

  const meta = getTypeGuardMeta(part);

  // Switch on type classification
  switch (meta.classification) {
    case 'literal': {
      return result.map((literal) => `${literal}${meta.literal}`);
    }

    case 'literals': {
      return result.flatMap((string) => {
        return meta.literals.map((literal) => `${string}${literal}`);
      });
    }

    case 'primitive': {
      // Check for boolean type guard
      /* istanbul ignore else */
      if (meta.primitive === 'boolean') {
        return result.flatMap((string) => {
          return [`${string}false`, `${string}true`];
        });
      }

      /* istanbul ignore next */
      throw TypeError(invalidTemplateLiteral);
    }

    case 'union': {
      return result.flatMap((string) => {
        return meta.union.flatMap((type) => {
          return reducePart([string], type);
        });
      });
    }

    /* istanbul ignore next */
    default: {
      throw TypeError(invalidTemplateLiteral);
    }
  }
};

/**
 * Reduce template literal to string literals
 */
const reduceTemplate = <
  S extends string,
  T extends ReducibleTemplateLiteral<S>
>(
  template: T
): TypeGuard => {
  // Check for empty template literal
  if (template.length === 0) {
    return isLiteral('');
  }

  // Check for only one string type guard
  if (
    hasOneElement(template) &&
    typeof template[0] === 'function' &&
    isStringTypeGuard(template[0])
  ) {
    return template[0];
  }

  const literals = template.reduce(reducePart, ['']);

  // Check for multiple literals
  if (hasAtLeastTwoElements(literals)) {
    return isLiteralOf(literals);
  }

  // Check for one literal
  /* istanbul ignore else */
  if (hasOneElement(literals)) {
    return isLiteral(literals[0]);
  }

  /* istanbul ignore next */
  throw TypeError(invalidTemplateLiteral);
};

/**
 * Get template literal annotation
 */
const getTemplateLiteralAnnotation = <L extends Literal>(
  template: StringifiedTemplateLiteral<L>
): string => {
  return `\`${template
    .map((type) => {
      // Check for type guard
      if (typeof type === 'function') {
        const { annotation, classification } = getTypeGuardMeta(type);

        // Check for optional type
        if (classification === 'optional') {
          throw TypeError(invalidOptionalType('template literal'));
        }

        return `\${${annotation}}`;
      }

      return type;
    })
    .join('')}\``;
};

/**
 * Stringify literals and omit empty strings
 */
const stringifyLiteral = (literal: Literal): string | [] => {
  // Check for string literal
  if (typeof literal === 'string') {
    // Check for empty string
    if (literal === '') {
      return [];
    }

    return literal;
  }

  return String(literal);
};

/**
 * Stringify template literal parts
 */
const stringifyParts = <L extends Literal>(
  part: L | TypeGuard<L>
): string | TypeGuard | StringifiedTemplateLiteral<any> => {
  // Check for type guard parts
  if (typeof part === 'function') {
    const meta = getTypeGuardMeta(part);

    // Switch on type classification
    switch (meta.classification) {
      case 'any': {
        return isString;
      }

      case 'literal': {
        return stringifyLiteral(meta.literal);
      }

      case 'template-literal': {
        return meta.template;
      }

      default: {
        return part;
      }
    }
  }

  return stringifyLiteral(part);
};

/**
 * Reduce strings and string type guards
 */
const reduceParts = (
  parts: StringifiedTemplateLiteral<any>,
  part: string | TypeGuard
): StringifiedTemplateLiteral<any> => {
  // Check for first or next parts
  if (parts.length > 0) {
    const index = parts.length - 1;
    const prev = parts[index];

    // Check for previous parts
    /* istanbul ignore else */
    if (prev) {
      if (typeof part === 'string') {
        if (typeof prev === 'string') {
          parts[index] = `${prev}${part}`;
        } else {
          parts.push(part);
        }
      } else if (isStringTypeGuard(part)) {
        if (typeof prev === 'string' || !isStringTypeGuard(prev)) {
          parts.push(part);
        }
      } else {
        parts.push(part);
      }
    }
  } else {
    parts.push(part);
  }

  return parts;
};

/**
 * Create a compact template
 */
const createTemplate = <L extends Literal, T extends TemplateLiteral<L>>(
  parts: T
): StringifiedTemplateLiteral<L> => {
  const template: StringifiedTemplateLiteral<L> = [];

  // @ts-expect-error TODO: fix this
  return values(parts).flatMap(stringifyParts).reduce(reduceParts, template);
};

/**
 * Check for template literal values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @note Does not accept types that cannot be represented as strings
 */
const isTemplateLiteralOf = <L extends Literal, T extends TemplateLiteral<L>>(
  parts: T
): TypeGuard<InferTemplateLiteral<T>> => {
  // Check for valid template literal provided
  if (!isArray(parts)) {
    throw TypeError(invalidTemplateLiteral);
  }

  /** @type {StringifiedTemplateLiteral<L>} */
  const template = createTemplate(parts);

  // Check if template can be reduced to literal check
  if (canReduceTemplate(template)) {
    return reduceTemplate(template);
  }

  const annotation = getTemplateLiteralAnnotation(template);
  const regexp = getTemplateLiteralREX(template);

  const check: TypeGuard<InferTemplateLiteral<T>> = (
    value: unknown
  ): value is InferTemplateLiteral<T> => isString(value) && regexp.test(value);

  // Save type guard meta
  setTypeGuardMeta(check, {
    annotation,
    classification: 'template-literal',
    description: `a template literal of ${annotation}`,
    regexp,
    template,
  });

  return check;
};

export { isTemplateLiteralOf, isTemplateLiteralOf as templateLiteral };
