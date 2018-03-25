export const campuri = [
  {
    id: 'nume',
    required: true
  },
  {
    id: 'servicii',
    type: 'servicii',
    required: true,
    servicii: getters => {
      console.log('gs', getters['servicii'])
      return getters.servicii && getters['asociatie/servicii'].length > 0 ? getters['asociatie/servicii'].map(denum => getters['servicii'][denum]) : {}
    },
    // servicii: getters => getters['servicii'].filter(serv => getters['asociatie/servicii'].indexOf(serv) > -1),
    ref: 'serviciu'
  },
  {
    id: 'idN'
  }
]

export const actiuni = {
  confirm: 'adaugaFurnizor'
}
