import {
  getObjectOf,
  getStrictObjectOf,
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
  parseObjectOf,
  parseStrictObjectOf,
  parseType,
  pick,
  strictObject,
} from '../lib';

const { assign, create } = Object;

const circularRefShape = '{\n "obj": <Circular Reference>;\n}';
const objectShape = '{\n "abc": string;\n}';
const optionalObjectShape = '{\n "abc"?: string;\n}';
const expected = `expected an object of shape ${objectShape}`;
const expectedKeys = 'expected strings or array of strings';
const expectedStrict = `expected an object of strict shape ${objectShape}`;
const expectedOptional = `expected an object of shape ${optionalObjectShape}`;
const invalidDefaultValue = 'Invalid default value type';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidMapping = 'Invalid object mapping provided';
const invalidShape = 'Invalid shape provided';
const invalidValue = 'Invalid value type';
const received = 'but received null';
const receivedEmptyObject = 'but received a value of type {}';
const receivedObject = 'but received a value of type {\n "abc": number;\n}';
const receivedCircularRef = `but received a value of type ${circularRefShape}`;

test('getObjectOf', () => {
  const getObjectABC = getObjectOf({ abc: isString }, { abc: '' });

  expect(getObjectABC()).toEqual({ abc: '' });
  expect(getObjectABC({ abc: '' })).toEqual({ abc: '' });
  expect(getObjectABC({ abc: 'abc' })).toEqual({ abc: 'abc' });
  expect(
    getObjectABC({
      abc: 'abc',
      def: 'def',
    })
  ).toEqual({
    abc: 'abc',
  });

  expect(() => {
    // @ts-expect-error - Expect throw
    getObjectOf({ abc: isString }, null);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${received}`));

  expect(() => {
    // @ts-expect-error - Expect throw
    getObjectOf({ abc: isOptional(isString) }, null);
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expectedOptional} ${received}`)
  );
});

test('getStrictObjectOf', () => {
  const getObjectABC = getStrictObjectOf({ abc: isString }, { abc: '' });

  expect(getObjectABC()).toEqual({ abc: '' });
  expect(getObjectABC({ abc: '' })).toEqual({ abc: '' });
  expect(getObjectABC({ abc: 'abc' })).toEqual({ abc: 'abc' });
  expect(getObjectABC({ abc: 'abc', def: 'def' })).toEqual({ abc: '' });

  expect(() => {
    // @ts-expect-error - Expect throw
    getStrictObjectOf({ abc: isString }, null);
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expectedStrict} ${received}`)
  );
});

test('isKeyOf', () => {
  expect(isKeyOf).toEqual(keyof);

  expect(isKeyOf(isObjectOf({ abc: isString }))('abc')).toBeTruthy();
  expect(isKeyOf(isObjectOf({ abc: isString }))('def')).toBeFalsy();
  expect(isKeyOf(isObjectOf({}))('abc')).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isKeyOf(isString);
  }).toThrow(TypeError('Invalid type provided, expected an object type'));
});

test('isObjectOf', () => {
  expect(isObjectOf).toEqual(object);

  expect(isObjectOf({})({})).toBeTruthy();
  expect(isObjectOf({ a: isString })({ a: 'abc' })).toBeTruthy();
  expect(isObjectOf({ a: isString })({ a: 'abc', b: 'def' })).toBeTruthy();
  expect(isObjectOf({ a: isOptional(isString) })({ a: 'abc' })).toBeTruthy();
  expect(isObjectOf({ a: isOptional(isString) })({})).toBeTruthy();
  expect(isObjectOf({ a: isOptional(isString) })({ a: undefined })).toBeFalsy();

  expect(
    isObjectOf({ a: isOptionalUndefined(isString) })({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isObjectOf({ a: isOptionalUndefined(isString) })({ a: undefined })
  ).toBeTruthy();
  expect(isObjectOf({ a: isOptionalUndefined(isString) })({})).toBeTruthy();
  expect(
    isObjectOf({ a: isOptionalUndefined(isString) })({ a: null })
  ).toBeFalsy();

  expect(isObjectOf({}, isRecordOf(isString, isString))({})).toBeTruthy();
  expect(
    isObjectOf({}, isRecordOf(isString, isString))({ a: 'a' })
  ).toBeTruthy();

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
  ).toBeTruthy();
  expect(
    isOmitFrom(
      isObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      abc: 'abc',
      def: 'def',
    })
  ).toBeFalsy();
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      def: 'def',
      ghi: 'ghi',
    })
  ).toBeTruthy();
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      abc: 'abc',
      def: 'def',
    })
  ).toBeFalsy();

  expect(
    isOmitFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      ghi: 'ghi',
    })
  ).toBeTruthy();
  expect(
    isOmitFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      abc: 'abc',
    })
  ).toBeFalsy();
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      ghi: 'ghi',
    })
  ).toBeTruthy();
  expect(
    isOmitFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      abc: 'abc',
    })
  ).toBeFalsy();

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
  ).toBeTruthy();
  expect(
    isPickFrom(
      isObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      def: 'def',
    })
  ).toBeFalsy();
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      abc: 'abc',
    })
  ).toBeTruthy();
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      'abc'
    )({
      def: 'def',
    })
  ).toBeFalsy();

  expect(
    isPickFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      abc: 'abc',
      def: 'def',
    })
  ).toBeTruthy();
  expect(
    isPickFrom(isObjectOf({ abc: isString, def: isString, ghi: isString }), [
      'abc',
      'def',
    ])({
      abc: 'abc',
    })
  ).toBeFalsy();
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      abc: 'abc',
      def: 'def',
    })
  ).toBeTruthy();
  expect(
    isPickFrom(
      isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
      ['abc', 'def']
    )({
      abc: 'abc',
    })
  ).toBeFalsy();

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

  expect(isStrictObjectOf({ a: isString })({ a: 'abc' })).toBeTruthy();
  expect(
    isStrictObjectOf({ a: isOptional(isString) })({ a: 'abc' })
  ).toBeTruthy();
  expect(isStrictObjectOf({ a: isOptional(isString) })({})).toBeTruthy();
  expect(
    isStrictObjectOf({ a: isOptionalUndefined(isString) })({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isStrictObjectOf({ a: isOptionalUndefined(isString) })({
      a: undefined,
    })
  ).toBeTruthy();
  expect(
    isStrictObjectOf({ a: isOptionalUndefined(isString) })({})
  ).toBeTruthy();
  expect(isStrictObjectOf({ a: isString })({ a: 'abc', b: 'def' })).toBeFalsy();
  expect(
    isStrictObjectOf({ a: isOptional(isString) })({ a: undefined })
  ).toBeFalsy();
  expect(
    isStrictObjectOf({ a: isOptionalUndefined(isString) })({ a: null })
  ).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isStrictObjectOf();
  }).toThrow(TypeError(invalidShape));
});

test('parseObjectOf', () => {
  const parseObjectABC = parseObjectOf({ abc: isString });

  expect(parseObjectABC({ abc: '' })).toEqual({ abc: '' });
  expect(parseObjectABC({ abc: '', def: null })).toEqual({ abc: '' });

  const obj: Record<string, unknown> = {};

  obj['obj'] = obj;

  expect(() => {
    parseObjectABC(null);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${received}`));

  expect(() => {
    parseObjectABC({});
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedEmptyObject}`));

  expect(() => {
    parseObjectABC({
      abc: 0,
    });
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedObject}`));

  expect(() => {
    parseObjectABC(obj);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedCircularRef}`));

  const parseObjectABCWithPrototype = parseObjectOf(
    assign(
      create({
        def: null,
      }),
      {
        abc: isString,
      }
    )
  );

  expect(parseObjectABCWithPrototype({ abc: '' })).toEqual({ abc: '' });
});

test('parseStrictObjectOf', () => {
  const parseObjectABC = parseStrictObjectOf({ abc: isString });

  expect(parseObjectABC({ abc: '' })).toEqual({ abc: '' });

  expect(() => {
    parseObjectABC(null);
  }).toThrow(TypeError(`${invalidValue}, ${expectedStrict} ${received}`));
});
