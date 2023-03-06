import { bigint, isBigInt } from '../lib/bigint';

test('isBigInt', () => {
  expect(isBigInt).toEqual(bigint);

  // @ts-expect-error - Expects 1 argument
  expect(isBigInt()).toBeFalsy();
  expect(isBigInt(0)).toBeFalsy();
  expect(isBigInt(0n)).toBeTruthy();
});
