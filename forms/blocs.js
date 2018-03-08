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
    value: 1,
    min: 0,
    max: 20
  },
  {
    id: 'adresa',
    type: 'textarea',
    label: 'blocs.adresa'
  },
  {
    id: 'scari',
    type: 'scari'
  }
]

export const actiuni = {
  confirm: 'adaugaBloc'
}
