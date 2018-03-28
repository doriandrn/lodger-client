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
    id: 'incasari',
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
    let incasari = this.incasari || []
    this.balanta += data.suma
    incasari.push(data.id)
    this.incasari = incasari
    await this.save()
  }
}
