import { searchables } from 'lodger'

const searchMap = (state, getters) => {
  const searchObjs = {}
  Object.keys(searchables).forEach(cat => {
    searchObjs[cat] = new Map()
    Object.values(getters[cat]).forEach(item => {
      let searchableString = ''
      searchables[cat].forEach(searchKey => { searchableString += `${item[searchKey]}` })
      searchObjs[cat].set(item._id, searchableString)
    })
  })
  return searchObjs
}

export { searchMap }
