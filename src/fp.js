/* eslint-disable import/no-extraneous-dependencies  */

import {
  map,
  every as all,
  compose,
  filter,
  flatten,
  identity,
  head,
  tail,
  has,
  curry,
  set,
  some as any
} from 'lodash/fp'

const indexMap = map.convert({ cap: false })

export {
  map,
  all,
  compose,
  filter,
  flatten,
  identity,
  head,
  tail,
  has,
  indexMap,
  curry,
  set,
  any
}
