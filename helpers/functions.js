export const traverse = function (o, fn) {
  for (let i in o) {
    fn.apply(this, [i, o[i]])  
    if (o[i] !== null && typeof(o[i]) === "object") traverse(o[i], fn)
  }
}

export const trm = str => str.replace('$', '')

export const spleet = str => {
  const split = String(str).split('/')

  return {
    what: split[0],
    mutation: split[1]
  }
}

/**
 * Transforma inputu la tastare
 * @param {*} filtersList  string - requested filters to comp
 * @param {*} value  string - value for
 * @param {*} filters  the object containing the filters ($options.filters)
 */
export const transformOnInput = (filtersList, value, filters, debug) => {
  if (!filtersList) return
  let val = value
  const _filters = filtersList.split('|')
  _filters.forEach(_filter => {
    let filter = _filter
    
    // :all = toate cuvintele
    if (filter.indexOf(':all')) {
      filter = filter.replace(':all', '')
      val = value.split(' ')
      val.forEach((word, i) => {
        try {
          val[i] = filters[filter](word)
        } catch (e) {
          debug(`Filtru incorect: ${filter}`, type, value)
        }
      })
      val = val.join(' ')
    } else {
      try {
        val = filters[filter](val)
      } catch (e) {
        debug(`Filtru incorect: ${filter}`, type, value)
      }
    }
  })
  return val
}
