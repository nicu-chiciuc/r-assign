import { StringifiedTemplateLiteral } from '.';
import { Literal, TypeGuard, Union } from '..';
import { getTypeGuardMeta } from './type-guard-meta';

const invalidTemplateLiteralType = 'Invalid type for template literal type';

const bigintRex = '(?:-?0|[1-9]\\d*)';
const decimalRex = '[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[Ee][+-]?\\d+)?';
const binaryRex = '0b[01]+';
const octalRex = '0o[0-7]+';
const hexRex = '0x[\\dA-Fa-f]+';
const numberRex = `(?:${decimalRex}|${binaryRex}|${octalRex}|${hexRex})`;
const stringRex = '(?:.*)';

const escapeRegExp = /[.*+?^${}()|[\]\\]/g;
const escapeReplace = '\\$&';

/**
 * Get regular expression string for the provided literals
 */
const getLiteralsREX = (literals: Literal[]): string =>
  `(?:${literals.map(String).join('|')})`;

/**
 * Map union types to regular expression strings
 */
const mapUnionREX = (union: Union) => {
  const result: string[] = [];

  return union.reduce((output, type) => {
    const meta = getTypeGuardMeta(type);

    // Switch on type classification
    switch (meta.classification) {
      case 'literal': {
        return [...output, String(meta.literal)];
      }

      case 'literals': {
        return [...output, getLiteralsREX(meta.literals)];
      }

      case 'primitive': {
        // Switch on primitive type
        switch (meta.primitive) {
          case 'bigint': {
            return [...output, bigintRex];
          }

          case 'number': {
            return [...output, numberRex];
          }

          case 'string': {
            return [...output, stringRex];
          }

          default: {
            throw TypeError(invalidTemplateLiteralType);
          }
        }
      }

      case 'template-literal': {
        return [...output, getTemplateLiteralREXString(meta.template)];
      }

      default: {
        throw TypeError(invalidTemplateLiteralType);
      }
    }
  }, result);
};

/**
 * Get regular expression string for union type
 */
const getUnionREXString = (union: Union): string =>
  `(?:${mapUnionREX(union).join('|')})`;

/**
 * Get regular expression string for the provided type guard
 */
const getTypeREXString = (type: TypeGuard): string => {
  const meta = getTypeGuardMeta(type);

  // Switch on type classification
  switch (meta.classification) {
    case 'literals': {
      return getLiteralsREX(meta.literals);
    }

    case 'primitive': {
      // Switch on primitive type
      switch (meta.primitive) {
        case 'bigint': {
          return bigintRex;
        }

        case 'number': {
          return numberRex;
        }

        case 'string': {
          return stringRex;
        }

        default: {
          throw TypeError(invalidTemplateLiteralType);
        }
      }
    }

    case 'union': {
      return getUnionREXString(meta.union);
    }

    default: {
      throw TypeError(invalidTemplateLiteralType);
    }
  }
};

/**
 * Get regular expression string for template literal type
 */
const getTemplateLiteralREXString = <L extends Literal>(
  template: StringifiedTemplateLiteral<L>
): string => {
  return template
    .map((part) => {
      // Check for type guard
      if (typeof part === 'function') {
        return getTypeREXString(part);
      }

      return part.replace(escapeRegExp, escapeReplace);
    })
    .join('');
};

/**
 * Wrap regular expression string in a regular expression
 */
const wrapREX = (string: string): RegExp => RegExp(`^${string}$`);

/**
 * Get template literal regular expression
 */
export const getTemplateLiteralREX = <L extends Literal>(
  template: StringifiedTemplateLiteral<L>
): RegExp => {
  return wrapREX(getTemplateLiteralREXString(template));
};

/**
 * Get type regular expression
 */
// TODO: Reanimate this function to use for intersection optimizer
// eslint-disable-next-line capitalized-comments
// const getTypeREX = (type: TypeGuard): RegExp => wrapREX(getTypeREXString(type));
