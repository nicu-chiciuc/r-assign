import {
  isArrayOf,
  isObjectOf,
  isOptional,
  isOptionalUndefined,
  isPartial,
  isPartialUndefined,
  isRecordOf,
  isStrictObjectOf,
  isString,
  isTupleOf,
  partial,
  partialUndef,
} from '../lib';

test('isPartial', () => {
  expect(isPartial).toEqual(partial);

  expect(isPartial(isArrayOf(isString))(['abc'])).toBe(true);
  expect(isPartial(isArrayOf(isString))([undefined])).toBe(true);
  expect(isPartial(isArrayOf(isString))([])).toBe(true);
  expect(isPartial(isArrayOf(isString))([1])).toBe(false);

  expect(isPartial(isObjectOf({ a: isString }))({})).toBe(true);
  expect(isPartial(isObjectOf({ a: isOptional(isString) }))({})).toBe(true);
  expect(isPartial(isObjectOf({ a: isOptionalUndefined(isString) }))({})).toBe(
    true
  );
  expect(isPartial(isObjectOf({ a: isString }))({ a: 'abc' })).toBe(true);
  expect(isPartial(isObjectOf({ a: isString }))({ a: 'abc', b: 'def' })).toBe(
    true
  );
  expect(isPartial(isObjectOf({ a: isString }))({ b: 'def' })).toBe(true);
  expect(isPartial(isObjectOf({ a: isString }))({ a: undefined })).toBe(false);

  expect(isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({})).toBe(
    true
  );
  expect(
    isPartial(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({})
  ).toBe(true);
  expect(
    isPartial(
      isObjectOf({ a: isOptionalUndefined(isString) }, isRecordOf(isString))
    )({})
  ).toBe(true);
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: 'abc',
    })
  ).toBe(true);
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: 'abc',
      b: 'def',
    })
  ).toBe(true);
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      b: 'def',
    })
  ).toBe(true);
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: 'abc',
      b: undefined,
    })
  ).toBe(true);
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: undefined,
    })
  ).toBe(false);
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: undefined,
      b: undefined,
    })
  ).toBe(false);

  expect(isPartial(isStrictObjectOf({ a: isString }))({})).toBe(true);
  expect(isPartial(isStrictObjectOf({ a: isOptional(isString) }))({})).toBe(
    true
  );
  expect(
    isPartial(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({})
  ).toBe(true);
  expect(isPartial(isStrictObjectOf({ a: isString }))({ a: 'abc' })).toBe(true);
  expect(
    isPartial(isStrictObjectOf({ a: isString }))({ a: 'abc', b: 'def' })
  ).toBe(false);
  expect(isPartial(isStrictObjectOf({ a: isString }))({ b: 'def' })).toBe(
    false
  );
  expect(isPartial(isStrictObjectOf({ a: isString }))({ a: undefined })).toBe(
    false
  );

  expect(isPartial(isTupleOf([isString]))([])).toBe(true);
  expect(isPartial(isTupleOf([isOptional(isString)]))([])).toBe(true);
  expect(isPartial(isTupleOf([isOptionalUndefined(isString)]))([])).toBe(true);
  expect(isPartial(isTupleOf([isString]))(['abc'])).toBe(true);
  expect(isPartial(isTupleOf([isString]))([undefined])).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isPartial();
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - Expect throw
    isPartial(isString);
  }).toThrow(TypeError);
});

test('isPartialUndefined', () => {
  expect(isPartialUndefined).toEqual(partialUndef);

  expect(isPartialUndefined(isObjectOf({ a: isString }))({})).toBe(true);
  expect(isPartialUndefined(isObjectOf({ a: isOptional(isString) }))({})).toBe(
    true
  );
  expect(
    isPartialUndefined(isObjectOf({ a: isOptionalUndefined(isString) }))({})
  ).toBe(true);
  expect(isPartialUndefined(isObjectOf({ a: isString }))({ a: 'abc' })).toBe(
    true
  );
  expect(
    isPartialUndefined(isObjectOf({ a: isString }))({ a: 'abc', b: 'def' })
  ).toBe(true);
  expect(isPartialUndefined(isObjectOf({ a: isString }))({ b: 'def' })).toBe(
    true
  );
  expect(
    isPartialUndefined(isObjectOf({ a: isString }))({ a: undefined })
  ).toBe(true);

  expect(isPartialUndefined(isStrictObjectOf({ a: isString }))({})).toBe(true);
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isOptional(isString) }))({})
  ).toBe(true);
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isOptionalUndefined(isString) }))(
      {}
    )
  ).toBe(true);
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({ a: 'abc' })
  ).toBe(true);
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({ a: undefined })
  ).toBe(true);
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({
      a: 'abc',
      b: 'def',
    })
  ).toBe(false);
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({ b: 'def' })
  ).toBe(false);

  expect(isPartialUndefined(isTupleOf([isString]))([])).toBe(true);
  expect(isPartialUndefined(isTupleOf([isOptional(isString)]))([])).toBe(true);
  expect(
    isPartialUndefined(isTupleOf([isOptionalUndefined(isString)]))([])
  ).toBe(true);
  expect(isPartialUndefined(isTupleOf([isString]))(['abc'])).toBe(true);
  expect(isPartialUndefined(isTupleOf([isString]))([undefined])).toBe(true);

  expect(() => {
    // @ts-expect-error - Expect throw
    isPartialUndefined();
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - Expect throw
    isPartialUndefined(isString);
  }).toThrow(TypeError);
});
