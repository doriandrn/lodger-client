export const campuri = [
  {
    id: 'catre',
    type: 'search',
    taxonomy: 'furnizori',
    ref: 'furnizori'
  },
  {
    id: 'suma',
    type: 'bani'
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
