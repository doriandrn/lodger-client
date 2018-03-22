export const campuri = [
  {
    id: 'nr',
    type: 'number',
    default: 1,
    required: true
  },
  {
    id: 'suprafata',
    type: 'number',
    default: 0.01,
    step: 0.01
  },
  {
    id: 'locatari',
    type: 'number',
    default: 0,
    min: 0,
    max: 10,
  },
  {
    id: 'proprietar',
    placeholder: 'Ion Barbu'
  },
  {
    id: 'etaj',
    type: 'number',
    required: true,
    notInForm: true,
    slot: 'footer'
  },
  {
    id: 'bloc',
    required: true,
    notInForm: true,
    slot: 'footer'
  },
  {
    id: 'scara',
    required: true,
    notInForm: true,
    slot: 'footer'
  },
  {
    id: 'balanta',
    type: 'bani',
    default: 0
  },
  {
    id: 'plati',
    type: 'array',
    notInForm: true,
    ref: 'incasari'
  }
]

export const actiuni = {
  confirm: 'adaugaAp'
}

export const metode = {
  async incaseaza (data) {
    if (!this.balanta) this.balanta = 0
    let plati = this.plati || []
    this.balanta += data.suma
    plati.push(data.id)
    this.plati = plati
    await this.save()
  }
}
