const campuri = [
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
    id: 'utilizatori',
    type: 'array',
    ref: 'utilizatori',
    notInForm: true
  },
  {
    id: 'servicii',
    type: 'array',
    ref: 'servicii',
    notInForm: true
  },
  {
    id: 'furnizori',
    type: 'array',
    ref: 'furnizori',
    notInForm: true
  },
  {
    id: 'filtreCheltuieli',
    type: 'array',
    notInForm: true
  }
]

const actiuni = {
  confirm: 'adaugaAsociatie'
}

const metode = {
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
  async TOGGLE_SERVICIU (servicii) {
    this.servicii = servicii
    await this.save()
  }
}

export { campuri, actiuni, metode }
