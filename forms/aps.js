export const campuri = [
  {
    id: 'nr',
    label: 'Nr',
    type: 'number',
    required: true
  },
  {
    id: 'suprafata',
    label: 'suprafata',
    type: 'number'
  },
  {
    id: 'locatari',
    label: 'locatari',
    type: 'number',
    min: 0,
    max: 10,
  },
  {
    id: 'proprietar',
    label: 'proprietar'
  },
  {
    id: 'etaj',
    type: 'number',
    label: 'etaj',
    required: true
  },
  {
    id: 'bloc',
    label: 'bloc',
    required: true
  },
  {
    id: 'scara',
    label: 'scara',
    required: true
  }
]

export const actiuni = {
  confirm: 'adaugaAp'
}
