import {
  isKeyOf,
  isObjectOf,
  isOmitFrom,
  isOptional,
  isOptionalUndefined,
  isPickFrom,
  isRecordOf,
  isStrictObjectOf,
  isString,
  keyof,
  object,
  omit,
  parseType,
  pick,
  strictObject,
} from '../lib';

const expectedKeys = 'expected strings or array of strings';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidMapping = 'Invalid object mapping provided';
const invalidShape = 'Invalid shape provided';

test('isKeyOf', () => {
  expect(isKeyOf).toEqual(keyof);

  expect(isKeyOf(isObjectOf({ abc: isString }))('abc')).toBe(true);
  expect(isKeyOf(isObjectOf({ abc: isString }))('def')).toBe(false);
  expect(isKeyOf(isObjectOf({}))('abc')).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isKeyOf(isString);
  }).toThrow(TypeError('Invalid type provided, expected an object type'));
});

test('isObjectOf', () => {
  expect(isObjectOf).toEqual(object);

  expect(isObjectOf({})({})).toBe(true);
  expect(isObjectOf({ a: isString })({ a: 'abc' })).toBe(true);
  expect(isObjectOf({ a: isString })({ a: 'abc', b: 'def' })).toBe(true);
  expect(isObjectOf({ a: isOptional(isString) })({ a: 'abc' })).toBe(true);
  expect(isObjectOf({ a: isOptional(isString) })({})).toBe(true);
  expect(isObjectOf({ a: isOptional(isString) })({ a: undefined })).toBe(false);

  expect(isObjectOf({ a: isOptionalUndefined(isString) })({ a: 'abc' })).toBe(
    true
  );
  expect(
    isObjectOf({ a: isOptionalUndefined(isString) })({ a: undefined })
  ).toBe(true);
  expect(isObjectOf({ a: isOptionalUndefined(isString) })({})).toBe(true);
  expect(isObjectOf({ a: isOptionalUndefined(isString) })({ a: null })).toBe(
    false
  );

  expect(isObjectOf({}, isRecordOf(isString, isString))({})).toBe(true);
  expect(isObjectOf({}, isRecordOf(isString, isString))({ a: 'a' })).toBe(true);

  expect(() => {
    // @ts-expect-error - Expect throw
    isObjectOf();
  }).toThrow(TypeError(invalidShape));

  expect(() => {
    // @ts-expect-error - Expect throw
    isObjectOf(null);
  }).toThrow(TypeError(invalidShape));

  expect(() => {
    // @ts-expect-error - Expect throw
    isObjectOf({}, isString);
  }).toThrow(TypeError(invalidMapping));

  expect(() => {
    isObjectOf({}, isStrictObjectOf({}));
  }).toThrow(TypeError(invalidMapping));

  expect(() => {
    parseType(isObjectOf({}, isObjectOf({ a: isString })))({});
  }).toThrow;
});

test('isOmitFrom', () => {
  expect(isOmitFrom).toEqual(omit);

  expect(
    isOmitFrom(
      isObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      def: 'def',
      ghi: 'ghi',
    })
  ).toBe(true);
  expect(
    isOmitFrom(
      isObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      abc: 'abc',
      def: 'def',
    })
  ).toBe(false);
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      def: 'def',
      ghi: 'ghi',
    })
  ).toBe(true);
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      abc: 'abc',
      def: 'def',
    })
  ).toBe(false);

  expect(
    isOmitFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      ghi: 'ghi',
    })
  ).toBe(true);
  expect(
    isOmitFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      abc: 'abc',
    })
  ).toBe(false);
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      ghi: 'ghi',
    })
  ).toBe(true);
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      abc: 'abc',
    })
  ).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isOmitFrom(isString);
  }).toThrow(TypeError('Invalid type provided, expected an object type'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isOmitFrom(isObjectOf({ abc: isString }));
  }).toThrow(TypeError(invalidKeysType));

  expect(() => {
    // @ts-expect-error - Expect throw
    isOmitFrom(isObjectOf({ abc: isString }), [0]);
  }).toThrow(TypeError(invalidKeysType));
});

test('isPickFrom', () => {
  expect(isPickFrom).toEqual(pick);

  expect(
    isPickFrom(
      isObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      abc: 'abc',
    })
  ).toBe(true);
  expect(
    isPickFrom(
      isObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      def: 'def',
    })
  ).toBe(false);
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      abc: 'abc',
    })
  ).toBe(true);
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      def: 'def',
    })
  ).toBe(false);

  expect(
    isPickFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      abc: 'abc',
      def: 'def',
    })
  ).toBe(true);
  expect(
    isPickFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      abc: 'abc',
    })
  ).toBe(false);
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      abc: 'abc',
      def: 'def',
    })
  ).toBe(true);
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      abc: 'abc',
    })
  ).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isPickFrom(isString);
  }).toThrow(TypeError('Invalid type provided, expected an object type'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isPickFrom(isObjectOf({ abc: isString }));
  }).toThrow(TypeError(invalidKeysType));

  expect(() => {
    // @ts-expect-error - Expect throw
    isPickFrom(isObjectOf({ abc: isString }), [0]);
  }).toThrow(TypeError(invalidKeysType));
});

test('isStrictObjectOf', () => {
  expect(isStrictObjectOf).toEqual(strictObject);

  expect(isStrictObjectOf({ a: isString })({ a: 'abc' })).toBe(true);
  expect(isStrictObjectOf({ a: isOptional(isString) })({ a: 'abc' })).toBe(
    true
  );
  expect(isStrictObjectOf({ a: isOptional(isString) })({})).toBe(true);
  expect(
    isStrictObjectOf({ a: isOptionalUndefined(isString) })({ a: 'abc' })
  ).toBe(true);
  expect(
    isStrictObjectOf({ a: isOptionalUndefined(isString) })({
      a: undefined,
    })
  ).toBe(true);
  expect(isStrictObjectOf({ a: isOptionalUndefined(isString) })({})).toBe(true);
  expect(isStrictObjectOf({ a: isString })({ a: 'abc', b: 'def' })).toBe(false);
  expect(isStrictObjectOf({ a: isOptional(isString) })({ a: undefined })).toBe(
    false
  );
  expect(
    isStrictObjectOf({ a: isOptionalUndefined(isString) })({ a: null })
  ).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isStrictObjectOf();
  }).toThrow(TypeError(invalidShape));
});
