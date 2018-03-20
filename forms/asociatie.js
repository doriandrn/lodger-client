export const campuri = [
  {
    id: 'name',
    label: 'asocs.new.name',
    required: true,
    focus: true,
    primary: true
  },
  {
    id: 'idN',
    label: 'asocs.new.idN'
  },
  {
    id: 'balanta',
    label: 'asocs.balance',
    type: 'number',
    notInAddForm: true
  },
  {
    id: 'incasari',
    type: 'array',
    ref: 'incasari',
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
