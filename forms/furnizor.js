export const campuri = [
  {
    id: 'nume',
    label: 'furnizor.nume',
    required: true
  },
  {
    id: 'servicii',
    label: 'furnizor.servicii',
    type: 'array',
    required: true,
    ref: 'serviciu'
  },
  {
    id: 'idN',
    label: 'furnizor.cif',
  }
]

export const actiuni = {
  confirm: 'adaugaFurnizor'
}
