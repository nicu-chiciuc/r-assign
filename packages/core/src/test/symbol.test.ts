import { getSymbol, isSymbol, parseSymbol, symbol } from '../lib/symbol';

const expected = 'expected a symbol value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedString = 'but received a value of type string';

test('getSymbol', () => {
  const getSymbolNoDefault = getSymbol();
  const s = Symbol();

  expect(getSymbolNoDefault()).toBe(s);
  expect(getSymbolNoDefault('data')).toEqual(s);
  expect(getSymbolNoDefault(null)).toEqual(s);

  const getSymbolRef = getSymbol(s);

  expect(getSymbolRef()).toEqual(s);
  expect(getSymbolRef(s)).toEqual(s);
  expect(getSymbolRef(null)).toEqual(s);

  expect(() => {
    // @ts-expect-error - Expect throw
    getSymbol(null);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

  expect(() => {
    // @ts-expect-error - Expect throw
    getSymbol('');
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expected} ${receivedString}`)
  );
});

test('isSymbol', () => {
  expect(isSymbol).toEqual(symbol);

  expect(isSymbol()).toBeFalsy();
  expect(isSymbol(Symbol())).toBeTruthy();
});

test('parseSymbol', () => {
  const s = Symbol();

  expect(parseSymbol(s)).toEqual(s);

  expect(() => {
    parseSymbol(null);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

  expect(() => {
    parseSymbol('');
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedString}`));

  expect(() => {
    parseSymbol(null, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`)
  );

  expect(() => {
    parseSymbol('', 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expected} ${receivedString}`)
  );
});
