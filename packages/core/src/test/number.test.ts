import {
  anyNumber,
  getAnyNumber,
  getNumber,
  isAnyNumber,
  isNumber,
  number,
  parseAnyNumber,
  parseNumber,
} from '../lib/number';

const expected = 'expected a number value but received';
const expectedFinite = 'expected a finite number value but received';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;

test('getAnyNumber', () => {
  const getNumberNoDefault = getAnyNumber();

  expect(getNumberNoDefault()).toEqual(0);
  expect(getNumberNoDefault(1)).toEqual(1);
  expect(getNumberNoDefault(null)).toEqual(0);
  expect(Number.isNaN(getNumberNoDefault(NaN))).toBeTruthy();
  expect(getNumberNoDefault(Infinity)).toEqual(Infinity);
  expect(getNumberNoDefault(-Infinity)).toEqual(-Infinity);

  const getNumberOneDefault = getAnyNumber(1);

  expect(getNumberOneDefault()).toEqual(1);
  expect(getNumberOneDefault(1)).toEqual(1);
  expect(getNumberOneDefault(null)).toEqual(1);
  expect(Number.isNaN(getNumberOneDefault(NaN))).toBeTruthy();
  expect(getNumberOneDefault(Infinity)).toEqual(Infinity);
  expect(getNumberOneDefault(-Infinity)).toEqual(-Infinity);

  const getNumberNaNDefault = getAnyNumber(NaN);

  expect(Number.isNaN(getNumberNaNDefault())).toBeTruthy();
  expect(getNumberNaNDefault(1)).toEqual(1);
  expect(Number.isNaN(getNumberNaNDefault(null))).toBeTruthy();
  expect(Number.isNaN(getNumberNaNDefault(NaN))).toBeTruthy();
  expect(getNumberNaNDefault(Infinity)).toEqual(Infinity);
  expect(getNumberNaNDefault(-Infinity)).toEqual(-Infinity);

  const getNumberInfinityDefault = getAnyNumber(Infinity);

  expect(getNumberInfinityDefault()).toEqual(Infinity);
  expect(getNumberInfinityDefault(1)).toEqual(1);
  expect(getNumberInfinityDefault(null)).toEqual(Infinity);
  expect(Number.isNaN(getNumberInfinityDefault(NaN))).toBeTruthy();
  expect(getNumberInfinityDefault(Infinity)).toEqual(Infinity);
  expect(getNumberInfinityDefault(-Infinity)).toEqual(-Infinity);

  expect(() => {
    // @ts-expect-error - Expect throw
    getAnyNumber(null);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} null`));
});

test('getNumber', () => {
  const getNumberNoDefault = getNumber();

  expect(getNumberNoDefault()).toEqual(0);
  expect(getNumberNoDefault(1)).toEqual(1);
  expect(getNumberNoDefault(null)).toEqual(0);
  expect(getNumberNoDefault(NaN)).toEqual(0);
  expect(getNumberNoDefault(Infinity)).toEqual(0);
  expect(getNumberNoDefault(-Infinity)).toEqual(0);

  const getNumberOneDefault = getNumber(1);

  expect(getNumberOneDefault()).toEqual(1);
  expect(getNumberOneDefault(1)).toEqual(1);
  expect(getNumberOneDefault(null)).toEqual(1);
  expect(getNumberOneDefault(NaN)).toEqual(1);
  expect(getNumberOneDefault(Infinity)).toEqual(1);
  expect(getNumberOneDefault(-Infinity)).toEqual(1);

  expect(() => {
    // @ts-expect-error - Expect throw
    getNumber(null);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expectedFinite} null`));

  expect(() => {
    getNumber(NaN);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expectedFinite} NaN`));

  expect(() => {
    getNumber(Infinity);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expectedFinite} Infinity`));

  expect(() => {
    getNumber(-Infinity);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expectedFinite} -Infinity`));
});

test('isAnyNumber', () => {
  expect(isAnyNumber).toEqual(anyNumber);

  expect(isAnyNumber()).toBeFalsy();
  expect(isAnyNumber(NaN)).toBeTruthy();
  expect(isAnyNumber(Infinity)).toBeTruthy();
  expect(isAnyNumber(-Infinity)).toBeTruthy();
  expect(isNumber(0)).toBeTruthy();
});

test('isNumber', () => {
  expect(isNumber).toEqual(number);

  expect(isNumber()).toBeFalsy();
  expect(isNumber(NaN)).toBeFalsy();
  expect(isNumber(Infinity)).toBeFalsy();
  expect(isNumber(-Infinity)).toBeFalsy();
  expect(isNumber(0)).toBeTruthy();
});

test('parseAnyNumber', () => {
  expect(parseAnyNumber(0)).toEqual(0);
  expect(Number.isNaN(parseAnyNumber(NaN))).toBeTruthy();
  expect(parseAnyNumber(Infinity)).toEqual(Infinity);
  expect(parseAnyNumber(-Infinity)).toEqual(-Infinity);

  expect(() => {
    // eslint-disable-next-line no-new-wrappers
    parseAnyNumber(new Number());
  }).toThrow(TypeError(`${invalidValue}, ${expected} an instance of Number`));

  expect(() => {
    parseAnyNumber(null);
  }).toThrow(TypeError(`${invalidValue}, ${expected} null`));

  expect(() => {
    parseAnyNumber(null, 'key');
  }).toThrow(TypeError(`${invalidValueWithProperty}, ${expected} null`));
});

test('parseNumber', () => {
  expect(parseNumber(0)).toEqual(0);

  expect(() => {
    // eslint-disable-next-line no-new-wrappers
    parseNumber(new Number());
  }).toThrow(
    TypeError(`${invalidValue}, ${expectedFinite} an instance of Number`)
  );

  expect(() => {
    parseNumber(null);
  }).toThrow(TypeError(`${invalidValue}, ${expectedFinite} null`));

  expect(() => {
    parseNumber(null, 'key');
  }).toThrow(TypeError(`${invalidValueWithProperty}, ${expectedFinite} null`));

  expect(() => {
    parseNumber(NaN);
  }).toThrow(TypeError(`${invalidValue}, ${expectedFinite} NaN`));

  expect(() => {
    parseNumber(NaN, 'key');
  }).toThrow(TypeError(`${invalidValueWithProperty}, ${expectedFinite} NaN`));

  expect(() => {
    parseNumber(Infinity);
  }).toThrow(TypeError(`${invalidValue}, ${expectedFinite} Infinity`));

  expect(() => {
    parseNumber(Infinity, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expectedFinite} Infinity`)
  );

  expect(() => {
    parseNumber(-Infinity);
  }).toThrow(TypeError(`${invalidValue}, ${expectedFinite} -Infinity`));

  expect(() => {
    parseNumber(-Infinity, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expectedFinite} -Infinity`)
  );
});
