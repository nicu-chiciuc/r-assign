import {
  isAny,
  isArrayOf,
  isNumber,
  isObjectOf,
  isOptional,
  isString,
  isTemplateLiteralOf,
  isTupleOf,
  isTupleRestOf,
  isUnionOf,
  parseType,
} from '../lib';

const emptyArray = 'an empty array []';
const expected = 'expected a string value';
// eslint-disable-next-line no-template-curly-in-string
const expectedTL = 'expected a template literal of `a-${string}`';
const invalidValue = 'Invalid value type';
const nestedArray = 'a value of type [][]';
const receivedUndefined = 'but received undefined';

/**
 * Append dot to the provided string
 */
const appendDot = (string: string) => `${string}.`;

test('parseType', () => {
  expect(parseType(isString)('abc')).toEqual('abc');
  expect(parseType(isString, appendDot)('abc')).toEqual('abc.');

  const any0 = { unreconized: true };

  expect(parseType(isAny)(any0)).toEqual(any0);

  const array0: [] = [];

  expect(parseType(isArrayOf(isString))(array0)).toEqual(array0);

  const array1 = ['a', 'b', 'c'];

  expect(parseType(isArrayOf(isString))(array1)).toEqual(array1);

  const array2 = ['a', 'b', { value: 'c' }];

  expect(
    parseType(
      isArrayOf(isUnionOf([isObjectOf({ value: isString }), isString]))
    )(array2)
  ).toBe(array2);

  const array3 = ['a', 'b', { unreconized: true, value: 'c' }];

  expect(
    parseType(
      isArrayOf(isUnionOf([isObjectOf({ value: isString }), isString]))
    )(array3)
  ).not.toBe(array3);

  expect(
    parseType(
      isArrayOf(isUnionOf([isObjectOf({ value: isString }), isString]))
    )(array3)
  ).toEqual(array2);

  const object0 = {};

  expect(parseType(isObjectOf({}))(object0)).toBe(object0);

  const object1 = {
    a: 'a',
    b: 'b',
    c: 'c',
  };

  expect(
    parseType(isObjectOf({ a: isString, b: isString, c: isString }))(object1)
  ).toBe(object1);

  const object2 = {
    a: 'a',
    b: 'b',
    c: 'c',
    unrecognized: true,
  };

  expect(
    parseType(isObjectOf({ a: isString, b: isString, c: isString }))(object2)
  ).not.toBe(object2);

  expect(
    parseType(isObjectOf({ a: isString, b: isString, c: isString }))(object2)
  ).toEqual(object1);

  const object3 = {
    a: 'a',
    b: 'b',
    c: { value: 'c' },
  };

  expect(
    parseType(
      isObjectOf({
        a: isString,
        b: isString,
        c: isUnionOf([isObjectOf({ value: isString }), isString]),
      })
    )(object3)
  ).toBe(object3);

  const object4 = {
    a: 'a',
    b: 'b',
    c: { unreconized: true, value: 'c' },
  };

  expect(
    parseType(
      isObjectOf({
        a: isString,
        b: isString,
        c: isUnionOf([isObjectOf({ value: isString }), isString]),
      })
    )(object4)
  ).not.toBe(object4);

  expect(
    parseType(
      isObjectOf({
        a: isString,
        b: isString,
        c: isUnionOf([isObjectOf({ value: isString }), isString]),
      })
    )(object4)
  ).toEqual(object3);

  const tuple0: [] = [];

  expect(parseType(isTupleOf([]))(tuple0)).toBe(tuple0);

  const tuple1 = ['a', 'b', 'c'];

  expect(parseType(isTupleOf([isString, isString, isString]))(tuple1)).toBe(
    tuple1
  );

  const tuple2 = ['a', 'b', { value: 'c' }];

  expect(
    parseType(isTupleOf([isString, isString, isObjectOf({ value: isString })]))(
      tuple2
    )
  ).toBe(tuple2);

  const tuple3 = ['a', 'b', { unreconized: true, value: 'c' }];

  expect(
    parseType(isTupleOf([isString, isString, isObjectOf({ value: isString })]))(
      tuple3
    )
  ).not.toBe(tuple3);

  expect(
    parseType(isTupleOf([isString, isString, isObjectOf({ value: isString })]))(
      tuple3
    )
  ).toEqual(tuple2);

  const tuple4 = ['a', 'b', 'c', 'd', { value: 'e' }];

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isString),
        isObjectOf({ value: isString }),
      ])
    )(tuple4)
  ).toBe(tuple4);

  const tuple5 = ['a', 'b', 'c', 'd', { unreconized: true, value: 'e' }];

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isString),
        isObjectOf({ value: isString }),
      ])
    )(tuple5)
  ).not.toBe(tuple5);

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isString),
        isObjectOf({ value: isString }),
      ])
    )(tuple5)
  ).toEqual(tuple4);

  const tuple6 = ['a', 'b', 'c', { value: 'd' }, { value: 'e' }];

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isString),
        isObjectOf({ value: isString }),
        isObjectOf({ value: isString }),
      ])
    )(tuple6)
  ).toBe(tuple6);

  const tuple7 = [
    'a',
    'b',
    'c',
    { value: 'd' },
    { unreconized: true, value: 'e' },
  ];

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isString),
        isObjectOf({ value: isString }),
        isObjectOf({ value: isString }),
      ])
    )(tuple7)
  ).not.toBe(tuple7);

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isString),
        isObjectOf({ value: isString }),
        isObjectOf({ value: isString }),
      ])
    )(tuple7)
  ).toEqual(tuple6);

  const tuple8 = ['a', { value: 'b' }, { value: 'c' }, { value: 'd' }, 'e'];

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isObjectOf({ value: isString })),
        isString,
      ])
    )(tuple8)
  ).toBe(tuple8);

  const tuple9 = [
    'a',
    { value: 'b' },
    { unreconized: true, value: 'c' },
    { value: 'd' },
    'e',
  ];

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isObjectOf({ value: isString })),
        isString,
      ])
    )(tuple9)
  ).not.toBe(tuple9);

  expect(
    parseType(
      isTupleOf([
        isString,
        isTupleRestOf(isObjectOf({ value: isString })),
        isString,
      ])
    )(tuple9)
  ).toEqual(tuple8);

  expect(() => {
    // @ts-expect-error - Expect throw
    parseType();
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    parseType(isString)();
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedUndefined}`));

  expect(() => {
    parseType(isString)([]);
  }).toThrow(
    TypeError(`${invalidValue}, ${expected} but received ${emptyArray}`)
  );

  expect(() => {
    parseType(isString)([[]]);
  }).toThrow(
    TypeError(`${invalidValue}, ${expected} but received ${nestedArray}`)
  );

  expect(() => {
    // @ts-expect-error - Expect throw
    parseType(isOptional(isString));
  }).toThrow(TypeError('Invalid use of optional type'));

  expect(() => {
    parseType(isTemplateLiteralOf(['a-', isString]))('');
  }).toThrow(TypeError(`${invalidValue}, ${expectedTL} but received ""`));

  expect(() => {
    // @ts-expect-error - Expect throw
    parseType(isNumber, appendDot)(0);
  }).toThrow;
});
