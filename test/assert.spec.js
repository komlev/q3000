/* eslint-disable one-var */
import { isExisty, isIndex, isWildcard } from '../src/assert'

describe('assert', () => {
  it('isIndex is returning correct value', () => {
    expect(isIndex(1)).toEqual(true)
    expect(isIndex('1')).toEqual(true)
    expect(isIndex('[1]')).toEqual(false)
    expect(isIndex('1a')).toEqual(false)
    expect(isIndex('team')).toEqual(false)
    expect(isIndex('team')).toEqual(false)
    expect(isIndex(null)).toEqual(false)
    expect(isIndex(undefined)).toEqual(false)
    expect(isIndex([])).toEqual(false)
  })

  it('isExisty is returning correct value', () => {
    expect(isExisty(null)).toEqual(false)
    expect(isExisty(undefined)).toEqual(false)
    expect(isExisty(0)).toEqual(true)
    expect(isExisty('a')).toEqual(true)
    expect(isExisty([])).toEqual(true)
    expect(isExisty(true)).toEqual(true)
    expect(isExisty(false)).toEqual(true)
  })

  it('isWildcard is returning correct value', () => {
    expect(isWildcard('*')).toEqual(true)
    expect(isWildcard(undefined)).toEqual(false)
    expect(isWildcard('')).toEqual(false)
  })
})
