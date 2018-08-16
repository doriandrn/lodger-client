import { Fields } from '../types/forms'

const fields: Fields = [
  {
    id: 'deLa',
    required: true,
    type: 'search',
    // taxonomy: 'apartamente',
    ref: 'apartamente'
  },
  {
    id: 'suma',
    type: 'bani',
    index: true,
    label: 'defaults.sum'
  },
  // TODO: adauga moneda, si la cheltuieli
  {
    id: 'la',
    index: true,
    type: 'date-time',
    notInForm: true
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
    value: getters => getters['asociatie/activa'].moneda
  },
  {
    id: 'asociatieId',
    notInForm: true,
    required: true,
    value: g => g['asociatie/activa']._id
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
