export const campuri = [
  {
    id: 'nume',
    placeholder: 'ex. M11, COCOR-2, A3...',
    type: 'text',
    required: true,
    focus: true
  },
  // {
  //   id: 'scariCount',
  //   type: 'number',
  //   required: true,
  //   default: 1,
  //   min: 0,
  //   max: 20
  // },
  {
    id: 'scari',
    type: 'scari',
    default: [{
      id: 1,
      etaje: 4
    }]
  },
  {
    id: 'adresa',
    type: 'textarea',
  },
  {
    id: 'asociatieId',
    type: 'select',
    notInForm: true,
    required: true,
    value: g => g['asociatie/activa'],
    options: g => g['asociatie/ids']
  }
]

export const actiuni = {
  confirm: 'adaugaBloc'
}
