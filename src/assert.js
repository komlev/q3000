import {
  isFunction,
  isString,
  isArray,
  isObject,
  isInteger,
  isSymbol
} from 'lodash'

const WILDCARD = '*',
  indexPattern = /^\d+$/,
  isUndefined = a => a === undefined,
  isNull = a => a === null,
  isExisty = a => !isUndefined(a) && !isNull(a),
  isStringIndex = a => isString(a) && indexPattern.test(a),
  isIndex = a => isInteger(a) || isStringIndex(a),
  isWildcard = a => a === WILDCARD

export {
  isExisty,
  isStringIndex,
  isIndex,
  isWildcard,
  isFunction,
  isUndefined,
  isNull,
  isString,
  isArray,
  isObject,
  isInteger,
  isSymbol
}
