import {
  getType,
  isString,
  isTupleOf,
  isArrayOf,
  isUnionOf,
  isNumber,
  isIntersectionOf,
  isBoolean,
  isFunction,
  isObjectOf,
  isOptional,
} from '../lib';

const expected = 'expected a string value';
const invalidDefaultValue = 'Invalid default value type';
const invalidReturn = 'Invalid function return';
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

  // TODO: fix this
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

  expect(() => {
    // @ts-expect-error - Expect throw
    getType();
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    getType(isString, ['a', 'b']);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${receivedArray}`));

  expect(() => {
    // @ts-expect-error - Expect throw
    getType(isOptional(isString), '');
  }).toThrow(TypeError('Invalid use of optional type'));

  expect(() => {
    // For some reason doesn't show an error
    //// @ts-expect-error - Expect throw

    getType(isString);
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expected} but received undefined`)
  );
});

test('getType: () => void', () => {
  const getFunction = getType(isFunction([]), () => null);
  const f = getFunction();

  expect(getFunction(() => undefined)()).toEqual(undefined);

  // TODO: fix test
  // expect(() => {
  //   // @ts-expect-error - Expect throw
  //   f(null);
  // }).toThrow(TypeError('Invalid function arguments'));

  // TODO: fix test
  // expect(() => {
  //   f();
  // }).toThrow(TypeError('Invalid function return, expected void'));
});

test('getType: () => string', () => {
  // @ts-expect-error - Expect throw
  const getFunction = getType(isFunction([], isString), () => null);
  const f = getFunction();

  expect(getFunction(() => '')()).toEqual('');

  // TODO: Fix this
  // expect(() => {
  //   // @ts-expect-error - Expect throw
  //   f(null);
  // }).toThrow(TypeError('Invalid function arguments'));

  expect(() => {
    f();
  }).toThrow(TypeError(`${invalidReturn}, ${expected} but received null`));
});

// test('getType: Promise<void>', async ({ end, rejects, resolveMatch }) => {
//   // @ts-expect-error - Expect throw
//   const getPromise = getType(isPromiseOf(), Promise.resolve(null));

//   await resolveMatch(getPromise(Promise.resolve()), undefined);

//   await rejects(() => getPromise());

//   end();
// });

// test('getType: Promise<string>', async ({ end, rejects, resolveMatch }) => {
//   // @ts-expect-error - Expect throw
//   const getPromise = getType(isPromiseOf(isString), Promise.resolve(null));

//   await resolveMatch(getPromise(Promise.resolve('')), '');

//   await rejects(() => getPromise());

//   end();
// });
