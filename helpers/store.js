import { searchables, defs } from 'lodger'

const searchMap = (state, getters) => {
  const searchObjs = {}
  Object.keys(searchables).forEach(cat => {
    searchObjs[cat] = new Map()
    Object.values(getters[cat]).forEach(item => {
      let searchableString = ''
      searchables[cat].forEach(searchKey => {
        let ss = ''
        if (searchKey.indexOf('.') > -1) {
          const splt = String(searchKey).split('.')
          const id = item[splt[0]]
          const key =splt[1]
          const what = defs.get(splt[0])
          ss = `${getters[what] && getters[what][id] ? getters[what][id][key] : ''} `
        } else {
          ss = `${item[searchKey]} `
        }
        console.log('ss', ss, getters)
        if (ss && ss !== 'undefined') searchableString += ss
      })
      searchableString = searchableString.trim()
      searchObjs[cat].set(item._id, searchableString)
    })
  })
  return searchObjs
}

export { searchMap }
