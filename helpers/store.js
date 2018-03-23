import { searchables } from 'lodger'

const searchMap = (state, getters) => {
  const searchObjs = {}
  Object.keys(searchables).forEach(cat => {
    searchObjs[cat] = new Map()
    Object.values(getters[cat]).forEach(item => {
      let searchString = ''
      searchables[cat].forEach(searchKey => { searchString += `${item[searchKey]}` })
      searchObjs[cat].set(item._id, searchableString)
    })
  })
  return searchObjs
}

export { searchMap }
