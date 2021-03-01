import type { TransformFunction } from 'r-assign';

/**
 * Check for boolean values
 */
const isBoolean: (value: any) => value is boolean;

/**
 * Creator of transform functions for boolean values
 */
const useBoolean: (initial?: boolean) => TransformFunction<boolean>;

/**
 * Transform function to validate boolean values
 */
const validateBoolean: TransformFunction<boolean>;

export {
	isBoolean,
	useBoolean,
	validateBoolean
};