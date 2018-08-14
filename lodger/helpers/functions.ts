import lodgerConfig from '../../lodger.config'
import { CriteriuGetterTaxonomie, Taxonomie } from '../types/defs'

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

// /**
//  * Returneaza 
//  * @param {*} taxonomie 
//  */
// const getCriteriuDefault = (taxonomie) => {
//   if (!taxonomie) return criteriuDefault
//   const tax = no$(taxonomie)
// }


/**
 * Returneaza config-ul pentru o taxonomie sau default
 * 
 * @param {string} taxonomie
 */
const getTaxonomyConfig = (tax: Taxonomie) => {
  const { taxonomii } = lodgerConfig
  const { defaults } = taxonomii
  if (!tax) return defaults
  const config = taxonomii[tax]
  return config ? config : defaults
}

// const criteriu = {
//   get () {
//     return taxonomie => {
//       const criteriu = taxonomie
//         ? getTaxonomyConfig(taxonomie)
//         : { ...defaults }

//       switch (taxonomie) {
//         case 'blocuri':
//         case 'incasari':
//         case 'cheltuieli':
//           Object.assign(criteriu.find, { asociatieId: getters['asociatie/activa']._id })

//         case 'apartament':
//           Object.assign(criteriu.find, { bloc: { $in: getters['bloc/ids'] } })
//       }
//       // servicii,furnizori, asociatii sunt globale, n-au nevoie de criteriu de cautare
//       return criteriu      
//     }
//   },

//   set (taxonomie, criteriu) {

//   }
// }

/**
 * Criteriu default pentru o taxonmoie ceruta
 * @param {string} taxonomie 
 * @param {object} criteriuCerut - poate fi diferit decat default
 */
const getCriteriu = (taxonomie: Taxonomie, criteriuCerut: CriteriuGetterTaxonomie) => {
  if (criteriuCerut && typeof criteriuCerut !== 'object') {
    throw new Error('criteriu incorect')
  }
  const { defaults } = taxConfig
  const criteriu = taxonomie
    ? getTaxonomyConfig(taxonomie)
    : { ...defaults }

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
