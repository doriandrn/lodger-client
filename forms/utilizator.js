export const campuri = [
  {
    id: '_id',
    notInDb: true,
    notInForm: true,
    value: g => g[getter]._id
  },
  {
    id: 'nume',
    required: true,
    encrypted: true
  },
  {
    id: 'emailPublic'
  },
  {
    id: 'rol',
    required: true,
    type: 'number',
    default: 0,
    notInForm: true
  },
  {
    id: 'alteDetaliiContact',
    type: 'contactFields',
  }
]

export const setari = {
  online: {
    campuri: [
      {
        id: 'parola',
        required: false,
        encrypted: true
      },
      {
        id: 'social',
        required: false,
        encrypted: true
      }
    ]
  }
}
