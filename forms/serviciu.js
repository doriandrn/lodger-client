export const campuri = [
  {
    id: 'denumire',
    required: true,
    isPrimary:true
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

export const actiuni = {
  confirm: 'adaugaServiciu'
}

export const predefinite = ['apa', 'electricitate', 'gaze', 'termoficare', 'internet', 'evacuare-gunoi-menajer']
