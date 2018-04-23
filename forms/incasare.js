export const campuri = [
  {
    id: 'deLa',
    required: true,
    type: 'search',
    focus: true,
    taxonomy: 'apartamente',
    ref: 'apartamente'
  },
  {
    id: 'suma',
    type: 'bani',
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
