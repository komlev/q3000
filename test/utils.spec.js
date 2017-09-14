/* eslint-disable one-var */
import { length, concat, until, parseIndex } from '../src/utils'

describe('utils', () => {
  it('parseIndex is returning correct value', () => {
    expect(parseIndex(1)).toEqual(1)
    expect(parseIndex('1')).toEqual(1)
    expect(parseIndex('1a')).toEqual('1a')
    expect(parseIndex('[1]')).toEqual('[1]')
    expect(parseIndex('team')).toEqual('team')
    expect(parseIndex(null)).toEqual(null)
    expect(parseIndex(undefined)).toEqual(undefined)
    expect(parseIndex([])).toEqual([])
  })

  it('until is working properly', () => {
    expect(until(a => a > 2, a => a + 1, 0)).toEqual(3)
  })

  it('length is returning correct value', () => {
    expect(length([1, 2, 3])).toEqual(3)
    expect(length('abc')).toEqual(3)
    expect(length(null)).toEqual(undefined)
    expect(length(undefined)).toEqual(undefined)
    expect(length(1)).toEqual(undefined)
    expect(length({})).toEqual(undefined)
    expect(length({ length: 99 })).toEqual(99)
  })

  it('concat is returning correct value', () => {
    expect(concat([1], [2])).toEqual([1, 2])
    expect(concat(1, 2)).toEqual([1, 2])
    expect(concat([], 2)).toEqual([2])
    expect(concat('a', 'b')).toEqual(['a', 'b'])
    expect(concat(1, ['b'])).toEqual([1, 'b'])
    expect(concat(1, null)).toEqual([1, null])
    expect(concat(null, null)).toEqual([null, null])
    expect(concat()).toEqual([])
  })
})
