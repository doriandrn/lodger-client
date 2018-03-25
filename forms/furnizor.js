export const campuri = [
  {
    id: 'nume',
    required: true
  },
  {
    id: 'servicii',
    type: 'array',
    required: true,
    ref: 'serviciu'
  },
  {
    id: 'idN'
  }
]

export const actiuni = {
  confirm: 'adaugaFurnizor'
}
