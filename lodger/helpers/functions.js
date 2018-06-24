import lodgerConfig from '../../lodger.config'
const criteriuDefault = lodgerConfig.taxonomii.defaults.criteriu

/**
 * Traverseaza un obiect cu o functie
 * 
 * @param {object} obiectul de traversat
 * @param {function} fn - callback -> cheie, valoare
 */
const traverse = function (o, fn) {
  for (let i in o) {
    fn.apply(this, [i, o[i]])  
    if (o[i] !== null && typeof(o[i]) === "object") traverse(o[i], fn)
  }
}

const getCriteriuDefault = (taxonomie) => {
  if (!taxonomie) return criteriuDefault
}

/**
 * Criteriu default pentru o taxonmoie ceruta
 * @param {string} taxonomie 
 */
const getCriteriu = (criteriuCerut, taxonomie) => {
  if (criteriuCerut && typeof criteriuCerut !== 'object') {
    throw new Error('criteriu incorect')
  }
  const criteriu = taxonomie ? getCriteriuDefault(taxonomie) : { ...criteriuDefault }
  Object.assign(criteriu, criteriuCerut)
  switch (taxonomie) {
    case 'blocuri':
    case 'incasari':
    case 'cheltuieli':
      Object.assign(criteriu.find, { asociatieId: getters['asociatie/activa']._id })

    case 'apartament':
      Object.assign(criteriu.find, { bloc: { $in: getters['bloc/ids'] } })
  }
  // servicii,furnizori, asociatii sunt globale, n-au nevoie de criteriu de cautare
  return criteriu
}

/**
 * Scoate '$' de la inceputul unui string
 * @param {string} str 
 */
const no$ = str => {
  if (typeof str !== 'string') return str
  if (str.indexOf('$') !== 0) return str
  return no$(str.replace('$', '').trim())
}

/**
 * Imparte un string de mutatie ('asociatie/INCASEAZA')
 * @param {string} str
 */
const spleet = str => {
  if (typeof str !== 'string' || str.indexOf('/') < 0) return str
  const split = String(str).split('/')

  return {
    what: split[0],
    mutation: split[1]
  }
}

/**
 * slug-ifica... destul de descriptiv :)
 * @param {string} text 
 */
const slugify = text => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export {
  traverse,
  no$,
  spleet,
  slugify,
  getCriteriu,
  getCriteriuDefault
}
