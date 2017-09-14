/* eslint-disable one-var */
import { filter, head, tail, has, identity, indexMap } from './fp'
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
import { length, concat, until } from './utils'

const addToCurrentPath = (context, path) => {
    let currentPath = path
    if (context.currentPath) {
      currentPath = concat(context.currentPath, currentPath)
    } else if (!isArray(currentPath)) {
      currentPath = [currentPath]
    }
    currentPath = filter(p => !isWildcard(p), currentPath)
    return Object.assign({}, context, { currentPath, goalPath: currentPath })
    // { ...context, currentPath, goalPath: currentPath }
  },
  getContextKey = (key, index) => (key && index === 0 ? key : `${key}${index}`),
  getNextContextKey = (context, key) => {
    const start = 0,
      transform = a => a + 1,
      indexes = context.indexes,
      nextIndex = until(
        (val) => {
          const index = getContextKey(key, val)
          return !isExisty(indexes) || isUndefined(indexes[index])
        },
        transform,
        start
      )

    return getContextKey(key, nextIndex)
  },
  addToCurrentIndexes = (context, key, index) => {
    const newKey = getNextContextKey(context, key),
      indexes = Object.assign({}, context.indexes, { [newKey]: index })
      // { ...context.indexes, [newKey]: index }
    // return { ...context, indexes }
    return Object.assign({}, context, { indexes })
  },
  putUnreachable = (context, pathLeft) => {
    const goalPath = concat(context.currentPath, pathLeft)
    return Object.assign({}, context, { goalPath, reached: false })
    // return { ...context, goalPath, reached: false }
  },
  _traverse = (path, value, mapFunc, context, currentKey = '') => {
    let resContext = context
    if (length(path) === 0) {
      if (!isExisty(resContext.currentPath)) {
        resContext.currentPath = path
        resContext.goalPath = path
      }
      resContext.reached = true
      return mapFunc(value, resContext)
    }

    let next = path && head(path),
      rest = path && tail(path)

    if (isArray(value)) {
      let fullArray = true
      if (isWildcard(next)) {
        fullArray = true
        next = head(rest)
      } else if (isIndex(next)) {
        fullArray = false
      } else {
        rest = path
      }

      if (fullArray) {
        const initialContext = resContext
        return indexMap((item, i) => {
          resContext = addToCurrentPath(initialContext, i)
          resContext = addToCurrentIndexes(resContext, currentKey, i)
          return _traverse(rest, item, mapFunc, resContext, currentKey)
        }, value)
      }
    }

    let nextValue = value,
      unrechanble = false,
      goalPath = path
    if (isObject(nextValue)) {
      resContext = addToCurrentPath(resContext, next)
      if (has(next, nextValue)) {
        return _traverse(rest, nextValue[next], mapFunc, resContext, next)
      }
      unrechanble = true
      goalPath = rest
    } else if (isString(nextValue) && isIndex(next)) {
      resContext = addToCurrentPath(resContext, next)
      nextValue = nextValue[next]
    } else if (!isExisty(nextValue) || length(path) > 0) {
      unrechanble = true
    }

    if (unrechanble) {
      nextValue = undefined
      resContext = putUnreachable(resContext, goalPath)
    }

    return mapFunc(nextValue, resContext)
  },
  traverse = (inPath, value, mapFunc = identity) => {
    const path = getPath(inPath)
    return _traverse(path, value, mapFunc, { path, reached: false })
  }

export default traverse
export { traverse }
