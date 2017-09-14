const data = {
  str: 'str',
  num: 1,
  list: [1, 2],
  listList: [[1, 2], [3, 4]],
  nul: null,
  undef: undefined,
  obj: {
    prop: 'prop'
  },
  objList: [
    {
      str: 'str1',
      list: [1, 2],
      nul: null,
      undef: undefined,
      objList: [{ str: 'str1', a: 1 }, { str: 'str2', b: 1 }]
    },
    {
      name: 'name2',
      list: [3, 4],
      nul: null,
      undef: undefined,
      objList: [{ str: 'str3', c: 1 }, { str: 'str4', d: 1 }]
    }
  ]
}

export default data
