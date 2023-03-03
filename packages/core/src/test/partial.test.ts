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

  expect(isPartial(isArrayOf(isString))(['abc'])).toBeTruthy();
  expect(isPartial(isArrayOf(isString))([undefined])).toBeTruthy();
  expect(isPartial(isArrayOf(isString))([])).toBeTruthy();
  expect(isPartial(isArrayOf(isString))([1])).toBeFalsy();

  expect(isPartial(isObjectOf({ a: isString }))({})).toBeTruthy();
  expect(isPartial(isObjectOf({ a: isOptional(isString) }))({})).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isOptionalUndefined(isString) }))({})
  ).toBeTruthy();
  expect(isPartial(isObjectOf({ a: isString }))({ a: 'abc' })).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isString }))({ a: 'abc', b: 'def' })
  ).toBeTruthy();
  expect(isPartial(isObjectOf({ a: isString }))({ b: 'def' })).toBeTruthy();
  expect(isPartial(isObjectOf({ a: isString }))({ a: undefined })).toBeFalsy();

  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({})
  ).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({})
  ).toBeTruthy();
  expect(
    isPartial(
      isObjectOf({ a: isOptionalUndefined(isString) }, isRecordOf(isString))
    )({})
  ).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: 'abc',
    })
  ).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: 'abc',
      b: 'def',
    })
  ).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      b: 'def',
    })
  ).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: 'abc',
      b: undefined,
    })
  ).toBeTruthy();
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: undefined,
    })
  ).toBeFalsy();
  expect(
    isPartial(isObjectOf({ a: isString }, isRecordOf(isString)))({
      a: undefined,
      b: undefined,
    })
  ).toBeFalsy();

  expect(isPartial(isStrictObjectOf({ a: isString }))({})).toBeTruthy();
  expect(
    isPartial(isStrictObjectOf({ a: isOptional(isString) }))({})
  ).toBeTruthy();
  expect(
    isPartial(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({})
  ).toBeTruthy();
  expect(
    isPartial(isStrictObjectOf({ a: isString }))({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isPartial(isStrictObjectOf({ a: isString }))({ a: 'abc', b: 'def' })
  ).toBeFalsy();
  expect(
    isPartial(isStrictObjectOf({ a: isString }))({ b: 'def' })
  ).toBeFalsy();
  expect(
    isPartial(isStrictObjectOf({ a: isString }))({ a: undefined })
  ).toBeFalsy();

  expect(isPartial(isTupleOf([isString]))([])).toBeTruthy();
  expect(isPartial(isTupleOf([isOptional(isString)]))([])).toBeTruthy();
  expect(
    isPartial(isTupleOf([isOptionalUndefined(isString)]))([])
  ).toBeTruthy();
  expect(isPartial(isTupleOf([isString]))(['abc'])).toBeTruthy();
  expect(isPartial(isTupleOf([isString]))([undefined])).toBeFalsy();

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

  expect(isPartialUndefined(isObjectOf({ a: isString }))({})).toBeTruthy();
  expect(
    isPartialUndefined(isObjectOf({ a: isOptional(isString) }))({})
  ).toBeTruthy();
  expect(
    isPartialUndefined(isObjectOf({ a: isOptionalUndefined(isString) }))({})
  ).toBeTruthy();
  expect(
    isPartialUndefined(isObjectOf({ a: isString }))({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isPartialUndefined(isObjectOf({ a: isString }))({ a: 'abc', b: 'def' })
  ).toBeTruthy();
  expect(
    isPartialUndefined(isObjectOf({ a: isString }))({ b: 'def' })
  ).toBeTruthy();
  expect(
    isPartialUndefined(isObjectOf({ a: isString }))({ a: undefined })
  ).toBeTruthy();

  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({})
  ).toBeTruthy();
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isOptional(isString) }))({})
  ).toBeTruthy();
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isOptionalUndefined(isString) }))(
      {}
    )
  ).toBeTruthy();
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({ a: undefined })
  ).toBeTruthy();
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({
      a: 'abc',
      b: 'def',
    })
  ).toBeFalsy();
  expect(
    isPartialUndefined(isStrictObjectOf({ a: isString }))({ b: 'def' })
  ).toBeFalsy();

  expect(isPartialUndefined(isTupleOf([isString]))([])).toBeTruthy();
  expect(
    isPartialUndefined(isTupleOf([isOptional(isString)]))([])
  ).toBeTruthy();
  expect(
    isPartialUndefined(isTupleOf([isOptionalUndefined(isString)]))([])
  ).toBeTruthy();
  expect(isPartialUndefined(isTupleOf([isString]))(['abc'])).toBeTruthy();
  expect(isPartialUndefined(isTupleOf([isString]))([undefined])).toBeTruthy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isPartialUndefined();
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - Expect throw
    isPartialUndefined(isString);
  }).toThrow(TypeError);
});
