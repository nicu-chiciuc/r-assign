import {
  getType,
  isArrayOf,
  isBoolean,
  isFunction,
  isIntersectionOf,
  isNumber,
  isObjectOf,
  isOptional,
  isString,
  isTupleOf,
  isUnionOf,
} from '../lib';

const expected = 'expected a string value';
const invalidDefaultValue = 'Invalid default value type';
const receivedArray = 'but received a value of type string[]';

/**
 * Append dot to the provided string
 */
const appendDot = (string: string) => `${string}.`;

test('getType', () => {
  const getString = getType(isString, '');

  expect(getString('abc')).toEqual('abc');
  expect(getString()).toEqual('');

  const getStringWithDot = getType(isString, '', appendDot);

  expect(getStringWithDot('abc')).toEqual('abc.');
  expect(getStringWithDot()).toEqual('.');

  const getStringTuple = getType(isTupleOf([isString]), ['']);

  expect(getStringTuple(['abc'])).toEqual(['abc']);
  expect(getStringTuple()).toEqual(['']);

  const getStringArray = getType(isArrayOf(isString), []);

  expect(getStringArray(['abc'])).toEqual(['abc']);
  expect(getStringArray()).toEqual([]);

  const getStringOrNumber = getType(isUnionOf([isString, isNumber]), '');

  expect(getStringOrNumber('abc')).toEqual('abc');
  expect(getStringOrNumber(0)).toEqual(0);
  expect(getStringOrNumber()).toEqual('');

  const getIntersectBNS = getType(
    isIntersectionOf([
      isUnionOf([isBoolean, isNumber]),
      isUnionOf([isNumber, isString]),
    ]),
    0
  );

  expect(getIntersectBNS(1)).toEqual(1);
  expect(getIntersectBNS()).toEqual(0);

  // TODO: figure this out
  // expect(
  //   getType(
  //     isIntersectionOf([isFunction([isString]), isFunction([isNumber])]),
  //     () => {
  //       /* Noop */
  //     }
  //   )()
  // ).toEqual(() => {
  //   /* Noop */
  // });

  const getObjectOfString = getType(
    isObjectOf({
      a: isOptional(isString),
    }),
    {}
  );

  expect(getObjectOfString({ a: 'abc' })).toEqual({ a: 'abc' });
  expect(getObjectOfString({ a: 'abc', b: 'def' })).toEqual({ a: 'abc' });
  expect(getObjectOfString({ a: 0 })).toEqual({});
  expect(getObjectOfString({})).toEqual({});
  expect(getObjectOfString()).toEqual({});

  const getFunction = getType(isFunction([]), () => null);
  const someFunction = getFunction(() => null);

  expect(() => {
    // @ts-expect-error - Expect error
    someFunction(null);
  }).toThrow(TypeError('Invalid function arguments'));

  expect(() => {
    someFunction();
  }).toThrow(TypeError('Invalid function return, expected void'));

  // @ts-expect-error - Expect error
  const getOtherFunction = getType(isFunction([], isString), () => null);
  const someOtherFunction = getOtherFunction(() => '');
  const someOtherDefaultFunction = getOtherFunction();

  expect(someOtherFunction()).toEqual('');

  expect(() => {
    someOtherDefaultFunction();
  }).toThrow(TypeError('Invalid function return'));

  expect(() => {
    // @ts-expect-error - Expect error
    getType();
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    // @ts-expect-error - Expect error
    getType(isString, ['a', 'b']);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${receivedArray}`));

  expect(() => {
    // @ts-expect-error - Expect error
    getType(isOptional(isString), '');
  }).toThrow(TypeError('Invalid use of optional type'));

  expect(() => {
    getType(isString);
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expected} but received undefined`)
  );
});
