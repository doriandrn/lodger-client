export const campuri = [
  {
    id: '_id',
    notInDb: true,
    notInForm: true,
    value: g => g['bloc/selectat']._id
  },
  {
    id: 'nume',
    placeholder: 'ex. M11, COCOR-2, A3...',
    transform: 'uppercase:all',
    type: 'text',
    required: true,
    v: 'min:1|max:20',
    focus: true,
    value: g => g['bloc/selectat'].nume
  },
  {
    id: 'scari',
    type: 'scari',
    default: [{
      id: 1,
      etaje: 4,
      lift: false,
      mansarda: false
    }],
    value: g => g['bloc/selectat'].scari
  },
  {
    id: 'adresa',
    type: 'textarea',
    value: g => g['bloc/selectat'].adresa
  },
  {
    id: 'asociatieId',
    type: 'select',
    notInForm: true,
    required: true,
    value: g => g['asociatie/activa']._id,
    options: g => g['asociatie/ids']
  }
]

export const actiuni = {
  confirm: 'adaugaBloc'
}
