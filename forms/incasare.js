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
  // {
  //   id: 'apSelectat',
  //   type: 'detaliiApSelectat',
  //   label: 'defaults.apSelectat',
  //   notInDb: true
  // },
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
    value: getters => Number(getters['asociatie/nrUltimaChitanta'] || 0) + 1
  },
  {
    id: 'asociatieId',
    notInForm: true
  }
]

export const actiuni = {
  confirm: 'incaseaza'
}
