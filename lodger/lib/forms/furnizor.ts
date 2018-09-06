export const fields = [
  {
    id: 'nume',
    required: true
  },
  {
    id: 'servicii',
    type: 'servicii',
    required: true,
    servicii: g => g['asociatie/activa'].servicii.map(denum => g.servicii[denum]) || {},
    ref: 'serviciu'
  },
  {
    id: 'idN'
  }
]

export const actiuni = {
  confirm: 'adaugaFurnizor'
}

export const plural = 'furnizori'