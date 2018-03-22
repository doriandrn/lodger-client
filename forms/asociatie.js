export const campuri = [
  {
    id: 'name',
    required: true,
    focus: true,
    primary: true
  },
  {
    id: 'idN'
  },
  {
    id: 'balanta',
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
    let incasari = this.incasari || []
    this.balanta += data.suma
    incasari.push(data.id)
    this.incasari = incasari
    await this.save()
  },
  async TOGGLE_SERVICIU (id) {
    let servicii = this.servicii || []
    const itemPosition = servicii.indexOf(id)
    if (itemPosition > -1) {
      servicii.splice(itemPosition, 1)
    } else {
      servicii.push(id)
    }
    this.servicii = servicii
    await this.save()
  }
}
