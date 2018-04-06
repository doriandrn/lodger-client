export const campuri = [
  {
    id: 'username',
    required: true,
    primary: true
  },
  {
    id: 'parola',
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
