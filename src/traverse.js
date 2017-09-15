/* eslint-disable one-var */
import {
  filter,
  head,
  tail,
  identity,
  assign,
  any,
  take,
  slice,
  get
} from 'lodash/fp'
import {
  isArray,
  isObject,
  isString,
  isUndefined,
  isExisty,
  isIndex,
  isWildcard
} from './assert'
import { getPath } from './path'
import { length, concat, until, indexMap } from './utils'

const addToContext = assign,
  hasStringIndexes = any(isWildcard),
  filterWildcards = filter(p => !isWildcard(p)),
  addPathToContext = (context, path) => {
    let current = path
    if (context.current) current = concat(context.current, current)
    else if (!isArray(current)) current = [current]

    if (hasStringIndexes(current)) current = filterWildcards(current)
    return addToContext(context, { current, goal: current })
  },
  getContextKey = (key, index) => (key && index === 0 ? key : `${key}${index}`),
  nextKeyTransform = a => a + 1,
  getNextContextKey = (context, key) => {
    const indexes = context.indexes,
      nextIndex = until(
        (val) => {
          const index = getContextKey(key, val)
          return !isExisty(indexes) || isUndefined(indexes[index])
        },
        nextKeyTransform,
        0
      )

    return getContextKey(key, nextIndex)
  },
  addIndexToContext = (context, key, index) => {
    const newKey = getNextContextKey(context, key),
      indexes = assign(context.indexes, { [newKey]: index })
    return addToContext(context, { indexes })
  },
  addUnreachableToContext = (context, restPath) => {
    const goal = concat(context.current, restPath)
    return addToContext(context, { goal, reached: false })
  },
  addRechableToContext = (context, path) => {
    const current = context.current || path,
      goal = context.goal || path
    return addToContext(context, { current, goal, reached: true })
  },
  // dirty method, works for now
  getTillSplit = (path, value) => {
    let tmp = value,
      nextIndex = until(
        (val) => {
          if (!isExisty(path) || !isExisty(tmp)) return true
          const item = path[val]
          if (
            (!isExisty(item) && val !== -1) ||
            (isArray(tmp) && !isIndex(item)) ||
            !isExisty(tmp)
          ) {
            return true
          }

          if (val === -1 || !isExisty(tmp)) return false
          tmp = tmp[item]
          return false
        },
        nextKeyTransform,
        -1
      )

    if (nextIndex === -1) nextIndex = 0
    return take(nextIndex, path)
  },
  _traverse = (inPath, inValue, mapFunc, context, currentKey = '') => {
    let resContext = context,
      value = inValue,
      path = inPath
    if (length(path) === 0) {
      resContext = addRechableToContext(resContext, path)
      return mapFunc(value, resContext)
    }

    // derty way, works now
    let flatPath = getTillSplit(path, value)
    if (length(flatPath) > 1) {
      flatPath = take(length(flatPath) - 1, flatPath)
      resContext = addPathToContext(resContext, flatPath)
      value = get(flatPath, value)
      path = slice(length(flatPath), Infinity, path)
    }

    let next = path && head(path),
      rest = path && tail(path)

    if (isArray(value)) {
      let fullArray = true
      if (isWildcard(next)) next = head(rest)
      else if (isIndex(next)) fullArray = false
      else rest = path

      if (fullArray) {
        const initialContext = resContext
        return indexMap((item, i) => {
          resContext = addPathToContext(initialContext, i)
          resContext = addIndexToContext(resContext, currentKey, i)
          return _traverse(rest, item, mapFunc, resContext, currentKey)
        }, value)
      }
    }

    let nextValue = value,
      unrechable = false,
      goal = path
    if (isObject(nextValue)) {
      resContext = addPathToContext(resContext, next)
      if (nextValue.hasOwnProperty(next)) { // eslint-disable-line
        return _traverse(rest, nextValue[next], mapFunc, resContext, next)
      }
      unrechable = true
      goal = rest
    } else if (isString(nextValue) && isIndex(next)) {
      resContext = addPathToContext(resContext, next)
      nextValue = nextValue[next]
    } else if (!isExisty(nextValue) || length(path) > 0) {
      unrechable = true
    }

    if (unrechable) {
      nextValue = undefined
      resContext = addUnreachableToContext(resContext, goal)
    }

    return mapFunc(nextValue, resContext)
  },
  traverse = (inPath, value, mapFunc = identity) => {
    const path = getPath(inPath)
    return _traverse(path, value, mapFunc, { path, reached: false })
  },
  traversePath = (path, value, mapFunc = identity) =>
    _traverse(path, value, mapFunc, { path, reached: false })

export default traverse
export { traverse, traversePath, getTillSplit }
