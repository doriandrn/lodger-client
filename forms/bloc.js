export const campuri = [
  {
    id: 'nume',
    placeholder: 'ex. M11, COCOR-2, A3...',
    type: 'text',
    label: 'bloc.new.name',
    required: true,
    focus: true
  },
  {
    id: 'scariCount',
    type: 'number',
    label: 'bloc.scari',
    required: true,
    default: 1,
    min: 0,
    max: 20
  },
  {
    id: 'scari',
    type: 'array',
    default: [{
      id: 1,
      etaje: 4
    }]
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
