const fields = [
  {
    id: 'asociatieId',
    ref: 'asociatii',
    required: true,
    index: true,
  },
  {
    id: 'catre',
    type: 'search',
    taxonomy: 'furnizori',
    ref: 'furnizori',
    // required: true TODO: e necesar? ?????????
  },
  {
    id: 'suma',
    type: 'bani',
    required: true,
    index: true,
    showInList: 'secondary'
  },
  {
    id: 'dataScadenta',
    type: 'date',
    showInList: 'secondary'
  },
  {
    id: 'modDistribuire',
    type: 'distribuire'
  },
  {
    id: 'apartamenteEligibile',
    type: 'selApartamente',
    options: getters => getters['asociatie/apartamente']
  },
  {
    id: 'moneda',
    notInForm: true,
    required: true,
    showInList: 'secondary',
    value: getters => getters['asociatie/activa'].moneda
  }
]

const plural = 'cheltuieli'

export {
  plural,
  fields
}
