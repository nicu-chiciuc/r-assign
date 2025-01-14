import type {
	Constructor,
	Intersection,
	Literal,
	OptionalTypeGuard,
	Tuple,
	TypeGuard,
	Union
} from 'r-assign/lib';

type ShapeEntries = [string, TypeGuard][];
type StringifiedTemplateLiteral<L extends Literal> = (TypeGuard<L> | string)[];
type ReducibleTemplateLiteral<S extends string> = (TypeGuard<S> | S)[];

type BaseTypeGuardMeta = {
	annotation: string;
	description: string;
};

type AnyTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'any';
};

type ArrayTypeGuardMeta = BaseTypeGuardMeta & {
	child: TypeGuardMeta;
	classification: 'array';
	same: boolean;
	type: TypeGuard;
};

type FunctionTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'function';
	input: TypeGuard<any[] | []>;
	output: TypeGuard | undefined;
};

type InstanceTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'instance';
	constructor: Constructor;
};

type IntersectionTypeGuardMeta = BaseTypeGuardMeta & {
	children: TypeGuardMeta[];
	classification: 'intersection';
	types: Intersection;
};

type LiteralTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'literal';
	literal: Literal;
};

type LiteralsTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'literals';
	literals: Literal[];
};

type NeverTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'never';
};

type ObjectTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'object';
	keys: string[];
	mapping?: TypeGuard<Record<keyof any, any>> | undefined;
	optional: ShapeEntries;
	required: ShapeEntries;
	same: boolean;
	strict: boolean;
};

type OptionalTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'optional';
	main: OptionalTypeGuard;
	type: TypeGuard;
	undef: boolean;
};

type PrimitiveTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'primitive';
} & (
	| { primitive: 'bigint' | 'boolean' | 'string' | 'symbol' }
	| { primitive: 'number'; finite: boolean }
);

type RecordTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'record';
	keys: TypeGuard<keyof any>;
	same: boolean;
	values: TypeGuard;
};

type RestTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'rest';
	type: TypeGuard;
};

type TemplateLiteralTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'template-literal';
	regexp: RegExp;
	template: StringifiedTemplateLiteral<any>;
};

type TupleTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'tuple';
	indexes: {
		optional: number;
		required: number;
		rest: number;
	};
	same: boolean;
	tuple: Tuple;
};

type UnionTypeGuardMeta = BaseTypeGuardMeta & {
	children: TypeGuardMeta[];
	classification: 'union';
	union: Union;
};

type TypeGuardMeta =
	| AnyTypeGuardMeta
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
	| IntersectionTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| NeverTypeGuardMeta
	| ObjectTypeGuardMeta
	| OptionalTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| RecordTypeGuardMeta
	| RestTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta;

type TypeClassification = TypeGuardMeta['classification'];

export type {
	ArrayTypeGuardMeta,
	ArrayTypeGuardMeta as ATGM,
	FunctionTypeGuardMeta,
	FunctionTypeGuardMeta as FTGM,
	LiteralTypeGuardMeta,
	LiteralTypeGuardMeta as LTGM,
	LiteralsTypeGuardMeta,
	LiteralsTypeGuardMeta as LsTGM,
	NeverTypeGuardMeta,
	NeverTypeGuardMeta as NTGM,
	ObjectTypeGuardMeta,
	ObjectTypeGuardMeta as OTTGM,
	OptionalTypeGuardMeta,
	OptionalTypeGuardMeta as OLTGM,
	PrimitiveTypeGuardMeta,
	PrimitiveTypeGuardMeta as PTGM,
	RecordTypeGuardMeta,
	RecordTypeGuardMeta as RDTGM,
	ReducibleTemplateLiteral,
	ReducibleTemplateLiteral as RTL,
	RestTypeGuardMeta,
	RestTypeGuardMeta as RTTGM,
	ShapeEntries,
	ShapeEntries as SE,
	StringifiedTemplateLiteral,
	StringifiedTemplateLiteral as STL,
	TemplateLiteralTypeGuardMeta,
	TemplateLiteralTypeGuardMeta as TLTGM,
	TupleTypeGuardMeta,
	TupleTypeGuardMeta as TTGM,
	TypeGuardMeta,
	TypeGuardMeta as TGM,
	TypeClassification,
	TypeClassification as TC,
	UnionTypeGuardMeta,
	UnionTypeGuardMeta as UTGM
};