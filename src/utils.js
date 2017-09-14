import { isIndex, isExisty } from './assert'

const concat = (a = [], b = []) => Array.prototype.concat(a, b),
  until = (pred, transform, initial) => {
    let res = initial
    while (!pred(res)) res = transform(res)
    return res
  },
  length = a => (isExisty(a) ? a.length : undefined),
  parseIndex = value => (isIndex(value) ? parseInt(value, 10) : value)

export { length, concat, until, parseIndex }
