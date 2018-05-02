export const campuri = [
  {
    id: 'catre',
    type: 'search',
    taxonomy: 'furnizori',
    ref: 'furnizori',
    required: true
  },
  {
    id: 'suma',
    type: 'bani',
    required: true
  },
  {
    id: 'dataScadenta',
    type: 'date'
  },
  {
    id: 'modDistribuire',
    type: 'distribuire'
  },
  {
    id: 'apartamenteEligibile',
    type: 'selApartamente',
    options: getters => getters['asociatie/apartamente']
  }
]

export const actiuni = []
