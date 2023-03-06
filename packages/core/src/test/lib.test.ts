import * as lib from '../lib';

const methods = [
  'any',
  'anyDate',
  'anyNumber',
  'array',
  'assertType',
  'bigint',
  'boolean',
  'date',
  'func',
  'instance',
  'intersection',
  'isAny',
  'isAnyDate',
  'isAnyNumber',
  'isArrayOf',
  'isBigInt',
  'isBoolean',
  'isDate',
  'isFunction',
  'isInstanceOf',
  'isIntersectionOf',
  'isKeyOf',
  'isLiteral',
  'isLiteralOf',
  'isNever',
  'isNull',
  'isNullable',
  'isNullish',
  'isNumber',
  'isObjectOf',
  'isOmitFrom',
  'isOptional',
  'isOptionalUndefined',
  'isPartial',
  'isPartialUndefined',
  'isPickFrom',
  'isRecordOf',
  'isRequired',
  'isStrictObjectOf',
  'isString',
  'isSymbol',
  'isTemplateLiteralOf',
  'isTupleOf',
  'isTupleRestOf',
  'isUndefined',
  'isUnionOf',
  'keyof',
  'literal',
  'literals',
  'never',
  'nullable',
  'nulled',
  'nullish',
  'number',
  'object',
  'optional',
  'optionalUndef',
  'omit',
  'partial',
  'partialUndef',
  'pick',
  'record',
  'required',
  'same',
  'setSame',
  'strictObject',
  'string',
  'symbol',
  'templateLiteral',
  'tuple',
  'tupleRest',
  'undef',
  'union',

  'parseType',
  'getType',
];

test('rAssign lib exports', () => {
  // Check that all methods are exported
  const compFunc = (a: string, b: string) => a.localeCompare(b);

  const libKeys = Object.keys(lib).sort(compFunc);
  const sortedMethods = [...methods].sort(compFunc);

  expect(libKeys).toEqual(sortedMethods);
});
