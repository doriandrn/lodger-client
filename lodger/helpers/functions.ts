import { Taxonomii } from 'lodger'
import LodgerConfig from '../../lodger.config'
type TraversableObject = { [index: string]: TraversableObject }
/**
 * Traverseaza un obiect cu o functie
 * 
 * @param {object} obiectul de traversat
 * @param {function} fn - callback -> cheie, valoare
 */
function traverse (o: TraversableObject, fn: Function) {
  for (let i in o) {
    fn.apply(this, [i, o[i]])
    if (o[i] !== null && typeof(o[i]) === "object") traverse(o[i], fn)
  }
}

/**
 * Returneaza config-ul pentru o taxonomie sau default
 * 
 * @param {string} taxonomie
 */
const getTaxonomyConfig = (tax: Taxonomii) => {
  const { taxonomii } = LodgerConfig
  const { defaults } = taxonomii
  if (!tax) return defaults
  const config = taxonomii[tax]
  return config ? config : defaults
}

/**
 * Criteriu default pentru o taxonmoie ceruta
 * 
 * @param {string} taxonomie 
 * @param {object} criteriuCerut - poate fi diferit decat default
 */
const getCriteriu = (taxonomie: Taxonomii, criteriuCerut?: Criteriu) => {
  if (criteriuCerut && typeof criteriuCerut !== 'object') {
    throw new Error('criteriu incorect')
  }
  if (Object.keys(Taxonomii).indexOf(taxonomie) < 0) {
    throw new Error('taxonomie incorecta')
  }
  const { defaults } = LodgerConfig.taxonomii
  let { criteriu } = defaults
  criteriu = Object.assign(criteriu, getTaxonomyConfig(taxonomie).criteriu)

  console.info('criteriu', criteriu)

  if (criteriuCerut) Object.assign(criteriu, criteriuCerut)
  switch (taxonomie) {
    case 'bloc':
    case 'incasare':
    case 'cheltuiala':
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
const no$ = (str: string): string => {
  if (typeof str !== 'string') return str
  if (str.indexOf('$') !== 0) return str
  return no$(str.replace('$', '').trim())
}

/**
 * Imparte un string de mutatie ('asociatie/INCASEAZA')
 * @param {string} str
 */
const spleet = (str: string) => {
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
const slugify = (text: string) => {
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
  getTaxonomyConfig
}
