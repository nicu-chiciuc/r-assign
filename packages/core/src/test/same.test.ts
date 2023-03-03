import {
  isArrayOf,
  isObjectOf,
  isRecordOf,
  isString,
  isTupleOf,
  parseType,
  same,
  setSame,
} from '../lib';

test('setSame', () => {
  expect(setSame).toBe(same);

  const array = ['a'];

  expect(parseType(setSame(isArrayOf(isString)))(array)).toBe(array);
  expect(parseType(setSame(isTupleOf([isString])))(array)).toBe(array);

  const object = { a: 'a', b: 'b' };

  expect(parseType(setSame(isObjectOf({ a: isString })))(object)).toBe(object);
  expect(parseType(setSame(isRecordOf(isString)))(object)).toBe(object);

  expect(() => {
    // @ts-expect-error - Expect throw
    setSame(isString);
  }).toThrow(TypeError);
});
