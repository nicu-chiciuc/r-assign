import {
  asString,
  convertToString,
  getString,
  isString,
  parseString,
  string,
} from '../lib/string';

const expected = 'expected a string value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedString = 'but received an instance of String';

test('asString', () => {
  expect(asString).toEqual(convertToString);

  expect(asString()).toEqual('undefined');
  expect(asString(null)).toEqual('null');
  expect(asString('')).toEqual('');
});

test('getString', () => {
  const getStringNoDefault = getString();

  expect(getStringNoDefault()).toEqual('');
  expect(getStringNoDefault('data')).toEqual('data');
  expect(getStringNoDefault(null)).toEqual('');

  const getStringData = getString('data');

  expect(getStringData()).toEqual('data');
  expect(getStringData('data')).toEqual('data');
  expect(getStringData(null)).toEqual('data');

  expect(() => {
    // @ts-expect-error - Test that it throws
    getString(null);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));
});

test('isString', () => {
  expect(isString).toEqual(string);

  expect(isString()).toBeFalsy();
  expect(isString('')).toBeTruthy();
});

test('parseString', () => {
  expect(parseString('')).toEqual('');

  expect(() => {
    // eslint-disable-next-line no-new-wrappers
    parseString(new String());
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedString}`));

  expect(() => {
    parseString(null);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

  expect(() => {
    parseString(null, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`)
  );
});
