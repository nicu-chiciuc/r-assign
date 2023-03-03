const arrayOrObject = 'object, record, array or tuple types';
const elementCantFollow = 'element cannot follow a';
const objectOrTuple = 'object or tuple types';
const typeOnlyFor = 'type can only be applied to';

export const invalidConstructor = 'Invalid constructor provided';
export const invalidDate = 'Invalid date value';
export const invalidLiteral = 'Invalid literal provided';
export const invalidLiterals = 'Invalid literals provided';
export const invalidOptional =
  'Optional type cannot be wrapped in optional type';
export const invalidPartial = `Partial ${typeOnlyFor} ${arrayOrObject}`;
export const invalidRequired = `Required ${typeOnlyFor} ${objectOrTuple}`;
export const invalidShape = 'Invalid shape provided';
export const invalidTemplateLiteral = 'Invalid template literal provided';
export const optionalAfterRest = `An optional ${elementCantFollow} rest element`;
export const requiredAfterOptional = `A required ${elementCantFollow}n optional element`;
export const restAfterRest = `A rest ${elementCantFollow}nother rest element`;
