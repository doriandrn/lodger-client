export const campuri = [
  {
    label: 'serviciu.denumire',
    id: 'denumire',
    required: true,
    isPrimary:true
  },
  {
    label: 'serviciu.furnizori',
    id: 'furnizori',
    type: 'array',
    notInForm: true
  }
]

export const actiuni = {
  confirm: 'adaugaServiciu'
}

export const predefinite = ['apa', 'electricitate', 'gaze', 'termoficare', 'internet', 'evacuare-gunoi-menajer']
