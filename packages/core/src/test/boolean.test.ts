import { boolean, getBoolean, isBoolean, parseBoolean } from '../lib/boolean';

const expected = 'expected a boolean value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedBoolean = 'but received an instance of Boolean';
const receivedNull = 'but received null';

test('getBoolean', () => {
  const getBooleanNoDefault = getBoolean();

  expect(getBooleanNoDefault()).toEqual(false);
  expect(getBooleanNoDefault(false)).toEqual(false);
  expect(getBooleanNoDefault(true)).toEqual(true);
  expect(getBooleanNoDefault(null)).toEqual(false);

  const getBooleanTrue = getBoolean(true);

  expect(getBooleanTrue()).toEqual(true);
  expect(getBooleanTrue(false)).toEqual(false);
  expect(getBooleanTrue(true)).toEqual(true);
  expect(getBooleanTrue(null)).toEqual(true);

  expect(() => {
    // @ts-expect-error - Expect throw
    getBoolean(null);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));
});

test('isBoolean', () => {
  expect(isBoolean).toEqual(boolean);

  expect(isBoolean()).toBeFalsy();
  expect(isBoolean(false)).toBeTruthy();
  expect(isBoolean(true)).toBeTruthy();
});

test('parseBoolean', () => {
  expect(parseBoolean(false)).toEqual(false);

  expect(() => {
    // eslint-disable-next-line no-new-wrappers
    parseBoolean(new Boolean());
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedBoolean}`));

  expect(() => {
    parseBoolean(null);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

  expect(() => {
    parseBoolean(null, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`)
  );
});
