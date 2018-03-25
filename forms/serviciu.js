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
  }
]

export const actiuni = {
  confirm: 'adaugaServiciu'
}

export const predefinite = ['apa', 'electricitate', 'gaze', 'termoficare', 'internet', 'evacuare-gunoi-menajer']
