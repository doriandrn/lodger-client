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
    type: 'number',
    default: 0.01,
    step: 0.01
  },
  {
    id: 'locatari',
    label: 'locatari',
    type: 'number',
    default: 0,
    min: 0,
    max: 10,
  },
  {
    id: 'proprietar',
    label: 'proprietar',
    placeholder: 'Ion Barbu'
  },
  {
    id: 'etaj',
    type: 'number',
    label: 'etaj',
    required: true,
    slot: 'footer'
  },
  {
    id: 'bloc',
    label: 'bloc',
    required: true,
    slot: 'footer'
  },
  {
    id: 'scara',
    label: 'scara',
    required: true,
    type: 'select',
    slot: 'footer'
  }
]

export const actiuni = {
  confirm: 'adaugaAp'
}
