export const campuri = [
  {
    id: 'nume',
    required: true
  },
  {
    id: 'servicii',
    type: 'array',
    required: true,
    servicii: getters => { console.log('CAL'); return getters['asociatie/servicii'] },
    ref: 'serviciu'
  },
  {
    id: 'idN'
  }
]

export const actiuni = {
  confirm: 'adaugaFurnizor'
}
