export const campuri = [
  {
    id: 'name',
    label: 'asociatie.new.name',
    required: true,
    focus: true,
    primary: true
  },
  {
    id: 'idN',
    label: 'asociatie.new.idN'
  },
  {
    id: 'balanta',
    label: 'asociatie.balance',
    type: 'number',
    notInAddForm: true
  },
  {
    id: 'incasari',
    type: 'array',
    ref: 'incasari',
    notInForm: true
  },
  {
    id: 'servicii',
    type: 'array',
    ref: 'servicii',
    notInForm: true
  }
]

export const actiuni = {
  confirm: 'adaugaAsociatie'
}

export const metode = {
  async initBalanta (data) {
    this.balanta = data.balanta
    await this.save()
  },
  async incaseaza (data) {
    if (!this.balanta) this.balanta = 0
    if (!this.incasari) this.incasari = []
    this.balanta += data.suma
    this.incasari.push(data.id)
    await this.save()
  }
}
