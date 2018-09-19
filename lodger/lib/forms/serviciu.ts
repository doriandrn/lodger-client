const fields = [
  {
    id: 'denumire',
    required: true,
    showInList: 'primary',
    isPrimary: true,
    index: true
  },
  {
    id: 'furnizori',
    type: 'array',
    notInForm: true
  },
  {
    id: 'contoare',
    type: 'contoare'
  }
]

const plural = 'servicii'

const actions = {
  confirm: 'adaugaServiciu'
}

const predefinite = ['apa', 'electricitate', 'gaze', 'termoficare', 'internet', 'evacuare-gunoi-menajer']

export {
  fields,
  plural,
  actions,
  predefinite
}
