export const campuri = [
  {
    id: 'deLa',
    required: true,
    type: 'search',
    taxonomy: 'apartamente',
    ref: 'apartamente'
  },
  {
    id: 'suma',
    type: 'bani',
    label: 'defaults.sum'
  },
  {
    id: 'la',
    index: true,
    type: 'date-time',
    notInForm: true
  },
  {
    id: 'nrChitanta',
    type: 'number',
    slot: 'footer',
    value: getters => getters['asociatie/nrUltimaChitanta']+1
  },
  {
    id: 'asociatieId',
    notInForm: true
  }
]

export const actiuni = {
  confirm: 'incaseaza'
}
