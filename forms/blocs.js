export const campuri = [
  {
    id: 'nume',
    placeholder: 'ex. M11, COCOR-2, A3...',
    type: 'text',
    label: 'blocs.new.name',
    required: true,
    focus: true
  },
  {
    id: 'scariCount',
    type: 'number',
    label: 'blocs.scari',
    required: true,
    default: 1,
    min: 0,
    max: 20
  },
  {
    id: 'scari',
    type: 'scari'
  },
  {
    id: 'adresa',
    type: 'textarea',
    label: 'defaults.address'
  },
  {
    id: 'asociatieId',
    type: 'select'
  }
]

export const actiuni = {
  confirm: 'adaugaBloc'
}
