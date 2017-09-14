import { forEach } from 'lodash/fp'
import { traverse } from '../src/traverse'

describe('traverse', () => {
  const data = {
    name: 'name',
    list: [1, 2],
    arr: [[1, 2], [3, 4]],
    team: [
      {
        name: 'name1',
        list: [{ item: 'item1' }, { item: 'item2' }],
        team: [1, 2]
      },
      {
        name: 'name2',
        list: [{ item: 'item3' }, { item: 'item4' }],
        team: [3, 4]
      }
    ]
  }

  it('traverse is returning corrent value', () => {
    // HAPPY PATH
    const cases = [
        [[], data, data],
        ['0.name', [{ name: 'name' }], 'name'],
        ['0', [{ name: 'name' }], { name: 'name' }],
        ['0', 'abc', 'a'],
        ['*.name', [{ name: 'name' }], ['name']],
        ['name', [{ name: 'name' }], ['name']],
        ['name', data, 'name'],
        ['abc', data, undefined],
        ['list', data, [1, 2]],
        ['list.*', data, [1, 2]],
        ['arr', data, [[1, 2], [3, 4]]],
        ['arr.0', data, [1, 2]],
        ['arr.0.0', data, 1],
        ['team.0.name', data, 'name1'],
        ['team.0.list.0.item', data, 'item1'],
        ['team.0.list.0.abc', data, undefined],
        ['team.name', data, ['name1', 'name2']],
        ['team.list.0.item', data, ['item1', 'item3']],
        ['team.list.2.item', data, [undefined, undefined]],
        ['team.list.item', data, [['item1', 'item2'], ['item3', 'item4']]],
        ['team.team.*', data, [[1, 2], [3, 4]]],
        ['team.0.team.0', data, 1],
        [[], null, null],
        ['0.name', null, undefined],
        ['0', null, undefined],
        ['*.name', null, undefined],
        ['name', null, undefined],
        ['name', null, undefined],
        ['abc', null, undefined],
        ['list', null, undefined],
        ['list.*', null, undefined],
        ['arr', null, undefined],
        ['arr.0', null, undefined],
        ['arr.0.0', null, undefined],
        ['team.0.name', null, undefined],
        ['team.0.list.0.item', null, undefined],
        ['team.0.list.0.abc', null, undefined],
        ['team.name', null, undefined],
        ['team.list.0.item', null, undefined],
        ['team.list.2.item', null, undefined],
        ['team.list.item', null, undefined],
        [undefined, data, undefined],
        [null, data, undefined],
        [1, data, undefined],
        [[null, undefined, 1], data, undefined],
        [{}, data, undefined]
      ],
      test = ([path, value, result]) => {
        expect(traverse(path, value)).toEqual(result)
      }

    forEach(test, cases)
  })

  it('traverse returns valid current paths', () => {
    const cases = [
        [[], [[]]],
        ['0.name', [[0, 'name']], [{ name: 'name' }]],
        ['0', [[0]], [{ name: 'name' }]],
        ['0', [[0]], 'abc'],
        [
          '*.name',
          [[0, 'name'], [1, 'name']],
          [{ name: 'name' }, { name: 'name' }]
        ],
        ['name', [[0, 'name']], [{ name: 'name' }]],
        ['name', [['name']]],
        ['abc', [['abc']]],
        ['list', [['list']]],
        ['list.*', [['list', 0], ['list', 1]]],
        ['arr', [['arr']]],
        ['arr.*', [['arr', 0], ['arr', 1]]],
        ['arr.0', [['arr', 0]]],
        ['arr.0.0', [['arr', 0, 0]]],
        ['arr.0.*', [['arr', 0, 0], ['arr', 0, 1]]],
        ['team.0.name', [['team', 0, 'name']]],
        ['team.0.list.0.item', [['team', 0, 'list', 0, 'item']]],
        ['team.0.list.0.abc', [['team', 0, 'list', 0, 'abc']]],
        ['team.name', [['team', 0, 'name'], ['team', 1, 'name']]],
        [
          'team.list.0.item',
          [['team', 0, 'list', 0, 'item'], ['team', 1, 'list', 0, 'item']]
        ],
        ['team.list.2.item', [['team', 0, 'list', 2], ['team', 1, 'list', 2]]],
        [
          'team.list.item',
          [
            ['team', 0, 'list', 0, 'item'],
            ['team', 0, 'list', 1, 'item'],
            ['team', 1, 'list', 0, 'item'],
            ['team', 1, 'list', 1, 'item']
          ]
        ]
      ],
      test = ([item, result, val]) => {
        const curPaths = [],
          run = (value, context) => {
            curPaths.push(context.currentPath)
          }
        traverse(item, val || data, run)
        expect(curPaths).toEqual(result)
      }

    forEach(test, cases)
  })

  it('traverse map function called proper number of times', () => {
    let counter = 0,
      res = []

    const mapFunc = (val) => {
        res.push(val)
        counter += 1
        return val
      },
      reset = () => {
        counter = 0
        res = []
      },
      cases = [
        [[], [data], 1],
        ['0.name', ['name'], 1, [{ name: 'name' }]],
        ['0', [{ name: 'name' }], 1, [{ name: 'name' }]],
        ['0', ['a'], 1, 'abc'],
        ['*.name', ['name', 'name'], 2, [{ name: 'name' }, { name: 'name' }]],
        ['name', ['name'], 1, [{ name: 'name' }]],
        ['name', ['name'], 1],
        ['abc', [undefined], 1],
        ['list', [[1, 2]], 1],
        ['list.*', [1, 2], 2],
        ['arr', [[[1, 2], [3, 4]]], 1],
        ['arr.*', [[1, 2], [3, 4]], 2],
        ['arr.0', [[1, 2]], 1],
        ['arr.0.0', [1], 1],
        ['arr.0.*', [1, 2], 2],
        ['team.0.name', ['name1'], 1],
        ['team.0.list.0.item', ['item1'], 1],
        ['team.0.list.0.abc', [undefined], 1],
        ['team.name', ['name1', 'name2'], 2],
        ['team.list.0.item', ['item1', 'item3'], 2],
        ['team.list.2.item', [undefined, undefined], 2],
        ['team.list.item', ['item1', 'item2', 'item3', 'item4'], 4]
      ],
      test = ([item, result, num, val]) => {
        reset()
        traverse(item, val || data, mapFunc)
        expect(res).toEqual(result)
        expect(counter).toEqual(num)
      }

    forEach(test, cases)
  })

  it('traverse map function is returning corrent value', () => {
    const mapContext = (val, context) => context.indexes,
      cases = [
        ['0.name', undefined, [{ name: 'name' }]],
        ['*.name', [{ 0: 0 }, { 0: 1 }], [{ name: 'name' }, { name: 'name' }]],
        ['name', [{ 0: 0 }], [{ name: 'name' }]],
        ['list.*', [{ list: 0 }, { list: 1 }]],
        [
          'team.list.item',
          [
            [{ team: 0, list: 0 }, { team: 0, list: 1 }],
            [{ team: 1, list: 0 }, { team: 1, list: 1 }]
          ]
        ]
      ],
      test = ([item, result, val]) => {
        const res = traverse(item, val || data, mapContext)
        expect(res).toEqual(result)
      }
    forEach(test, cases)
  })

  it('traverse cotext has proper reach flag', () => {
    const mapContext = (val, context) => context.reached
    expect(traverse([], { name: 'name' }, mapContext)).toEqual(true)
    expect(traverse('name', { name: 'hello' }, mapContext)).toEqual(true)
    expect(traverse('0.name', [{ name: 'name' }], mapContext)).toEqual(true)
    expect(
      traverse(
        '*.name',
        [
          { name: 'name' },
          { name: 'name' },
          1,
          null,
          undefined,
          {},
          { name: null },
          { name: undefined }
        ],
        mapContext
      )
    ).toEqual([true, true, false, false, false, false, true, true])
    expect(traverse('a.b', { a: {} }, mapContext)).toEqual(false)
    expect(traverse('a.b', { a: { b: undefined } }, mapContext)).toEqual(true)
    expect(traverse('a.b', {}, mapContext)).toEqual(false)
    expect(traverse('a.b', { a: null }, mapContext)).toEqual(false)
    expect(traverse('0', [], mapContext)).toEqual(false)
    expect(traverse('0', [1], mapContext)).toEqual(true)
  })
})
