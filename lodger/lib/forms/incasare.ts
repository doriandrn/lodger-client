import { Getter } from 'vuex'

const fields: Fields = [
  {
    id: 'apartamentId', //aka DE LA
    required: true,
    type: 'search',
    ref: 'apartamente'
  },
  {
    id: 'suma',
    type: 'bani',
    showInList: 'primary',
    index: true,
    required: true,
    label: 'defaults.sum'
  },
  {
    id: 'nrChitanta',
    type: 'number',
    default: 1,
    index: true,
    value: getters => Number(getters['asociatie/nrUltimaChitanta'] || 0) + 1
  },
  {
    id: 'moneda',
    notInForm: true,
    required: true,
    value: getters => getters['asociatie/moneda']
  },

  // ASTA TREBUIE SA RAMANA IN CAZ CA UN APARTAMENT SE STERGE
  // TREBUIE SA FIGUREZE
  // asociatieId = idul asociatiei apului
  /// !!!!!!!!!!!!!!!!

  {
    id: 'asociatieId',
    notInForm: true,
    required: true,
    index: true,
    value: (g: Getter<AsociatieState, RootState>) => g['asociatie/active'] || g['asociatie/selected']
  }
]

const actions = {
  confirm: 'incaseaza'
}

const plural = 'incasari'

export {
  fields,
  actions,
  plural
}
