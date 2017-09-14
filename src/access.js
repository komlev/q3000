import { set as fpSet } from './fp'
import { traverse } from './traverse'

const get = (path, value, defaultValue) => {
    const result = traverse(path, value)
    if (result === undefined) return defaultValue
    return result
  },
  set = (path, prop, value, create = true) => {
    let res = value
    const mapFunc = (val, context) => {
      if (context.reached) {
        res = fpSet(context.currentPath, prop, res)
      } else if (create) {
        res = fpSet(context.goalPath, prop, res)
      }
      return val
    }

    traverse(path, value, mapFunc)
    return res
  }

export { get, set }
