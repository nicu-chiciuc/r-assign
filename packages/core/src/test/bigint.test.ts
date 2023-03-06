import { bigint, isBigInt } from '../lib/bigint';

test('isBigInt', () => {
  expect(isBigInt).toEqual(bigint);

  // @ts-expect-error - Expects 1 argument
  expect(isBigInt()).toBe(false);
  expect(isBigInt(0)).toBe(false);
  expect(isBigInt(0n)).toBe(true);
});
