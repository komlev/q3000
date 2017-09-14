import { get, set } from '../src/access'
import data from './data'

describe('access', () => {
  it('get returns correct value', () => {
    expect(get('str', data)).toEqual('str')
    expect(get('num', data)).toEqual(1)
    expect(get('nul', data)).toEqual(null)
    expect(get('listList.0', data)).toEqual([1, 2])
    expect(get('listList.0.1', data)).toEqual(2)
    expect(get('obj.prop', data)).toEqual('prop')
    expect(get('obj.*', data)).toEqual(undefined)
    expect(get('obj.*.prop', data)).toEqual(undefined)
    expect(get('objList.*.objList.str', data)).toEqual([
      ['str1', 'str2'],
      ['str3', 'str4']
    ])
    expect(get('objList.*.objList.a', data)).toEqual([
      [1, undefined],
      [undefined, undefined]
    ])

    expect(get(['*'], [1, 2])).toEqual([1, 2])

    expect(get('random', null)).toEqual(undefined)
    expect(get('random', undefined)).toEqual(undefined)
    expect(get(['name'], { name: 'name' })).toEqual('name')
  })

  it('set returns correct value', () => {
    expect(set('*.boo.z', 1, [{}, {}])).toEqual([
      { boo: { z: 1 } },
      { boo: { z: 1 } }
    ])
    expect(set('*', 1, [0, 0])).toEqual([1, 1])
    expect(set('a.b.c', 1, null)).toEqual({ a: { b: { c: 1 } } })

    const obj = { a: 1 },
      obj2 = set('b.c', 1, obj)
    expect(obj2).toEqual({ a: 1, b: { c: 1 } })
    expect(obj2 === obj).toEqual(false)
  })
})
