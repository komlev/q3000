import { getPath, isPath } from '../src/path'

describe('path', () => {
  const stringFunc = () => 'user',
    arrFunc = () => ['array'],
    nullFunc = () => null

  it('isPath returns correct value', () => {
    expect(isPath('assa.asas')).toEqual(false)
    expect(isPath(['assa.asas', 'dasd.ad'])).toEqual(false)
    expect(isPath(['assa', '[0]', 'ad'])).toEqual(false)
    expect(isPath(['assa', 'ad'])).toEqual(true)
  })

  it('getPath is returning correct value', () => {
    // happy path
    expect(getPath(stringFunc)).toEqual(['user'])
    expect(getPath([stringFunc])).toEqual(['user'])
    expect(getPath(arrFunc)).toEqual(['array'])
    expect(getPath([arrFunc])).toEqual(['array'])
    expect(getPath(0)).toEqual([0])
    expect(getPath('name')).toEqual(['name'])
    expect(getPath('name.')).toEqual(['name', ''])
    expect(getPath('name.some')).toEqual(['name', 'some'])
    expect(getPath('name[*]boo')).toEqual(['name', '*', 'boo'])
    expect(getPath('name[0]')).toEqual(['name', 0])
    expect(getPath('name[0]name')).toEqual(['name', 0, 'name'])
    expect(getPath('name[0].name')).toEqual(['name', 0, 'name'])
    expect(getPath(['name', ''])).toEqual(['name', ''])
    expect(getPath(['user', 0, undefined, 'name'])).toEqual(['user', 0, 'name'])
    expect(getPath(['user', 0, null, 'name'])).toEqual(['user', 0, 'name'])
    expect(getPath(['name'])).toEqual(['name'])
    expect(getPath(['user.name'])).toEqual(['user', 'name'])
    expect(getPath(['user', 'name'])).toEqual(['user', 'name'])
    expect(getPath(['user.0.name'])).toEqual(['user', 0, 'name'])
    expect(getPath(['user', 0, 'name'])).toEqual(['user', 0, 'name'])
    expect(getPath(['user', '0', 'name'])).toEqual(['user', 0, 'name'])
    expect(getPath(['user', 'name.last'])).toEqual(['user', 'name', 'last'])

    // invalid
    expect(getPath([])).toEqual([])
    expect(getPath(undefined)).toEqual(undefined)
    expect(getPath(null)).toEqual(null)
    expect(getPath([nullFunc])).toEqual([])
    expect(getPath(nullFunc)).toEqual(null)
    expect(getPath({})).toEqual(null)
    expect(getPath(new Error('error'))).toEqual(null)
    const symb = Symbol('test')
    expect(getPath([symb])).toEqual([symb])
  })
})
