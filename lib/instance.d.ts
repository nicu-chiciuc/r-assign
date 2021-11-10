import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

type Instance<T = any> = new (...args: any[]) => T;

type InferInstance<T extends Instance> = T extends Instance<infer I>
	? I
	: never;

/**
 * Extract instance values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getInstanceOf<I extends Instance>(
	type: I,
	initial: InferInstance<I>
): TransformFunction<InferInstance<I>>;

/**
 * Check for instance values
 */
declare function isInstanceOf<I extends Instance>(
	type: I
): TypeGuard<InferInstance<I>>;

/**
 * Extract and validate instance values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare function parseInstanceOf<I extends Instance>(
	type: I
): TransformFunction<InferInstance<I>>;

export {
	getInstanceOf,
	isInstanceOf,
	parseInstanceOf,
	InferInstance,
	Instance
};