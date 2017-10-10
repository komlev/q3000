import { map, all, compose, filter, flatten, any } from 'lodash/fp'
import {
  isFunction,
  isString,
  isArray,
  isObject,
  isInteger,
  isSymbol,
  isExisty,
  isIndex,
  isStringIndex
} from './assert'
import { parseIndex } from './utils'

const flattenFilter = compose(filter(isExisty), flatten),
  hasSeparators = a => a.indexOf('.') !== -1,
  hasBrakets = a => a.indexOf('[') !== -1 || a.indexOf(']') !== -1,
  isPathItemValid = (p) => {
    let result = isString(p) && !hasSeparators(p) && !hasBrakets(p)
    if (isIndex(p)) result = result && isInteger(p)
    return result
  },
  allItemsValid = all(isPathItemValid),
  isPath = path => isArray(path) && allItemsValid(path),
  hasStringIndexes = any(isStringIndex),
  mapIndex = (d) => {
    if (isStringIndex(d)) return parseIndex(d)
    return d
  },
  mapIndexes = r => r.map(mapIndex),
  getPath = (path) => {
    if (isPath(path)) return path
    let result = path
    if (isFunction(result)) {
      result = getPath(result())
    }
    const isArr = isArray(result)
    if (isObject(result) && !isArr) return null
    if (!isExisty(result)) return result
    if (isArr) {
      result = map(p => getPath(p), result)
    }
    if (isString(result)) {
      if (hasBrakets(result)) {
        result = result.replace('[', '.')
        const index = result.indexOf(']')
        let closeSymbol = '.'
        if (index === result.length - 1 || result[index + 1] === '.') {
          closeSymbol = ''
        }
        result = result.replace(']', closeSymbol)
      }
      if (hasSeparators(result)) {
        result = result.split('.')
        if (hasStringIndexes(result)) {
          result = mapIndexes(result)
        }
      } else {
        if (isStringIndex(result)) result = parseIndex(result)
        result = [result]
      }

      return result
    }
    if (isInteger(result) || isSymbol(result)) result = [result]
    return flattenFilter(result)
  }

export default getPath
export { getPath, isPath }
