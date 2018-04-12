export const campuri = [
  {
    id: 'nr',
    type: 'number',
    default: getters => {
      const bloc = getters['modal/data'].bloc
      console.log('blc', bloc)
      if (!bloc) return 1
      const ultimulApAdaugat = getters.apartamente[getters['apartament/ultim']]
      console.log('UA', ultimulApAdaugat)
      if (!ultimulApAdaugat || bloc !== ultimulApAdaugat.bloc) {
        const apsBloc = Object.values(getters.apartamente).filter(ap => ap.bloc === bloc)
        if (!apsBloc || !apsBloc.length) return 1
        return Number(apsBloc.sort((a, b) => a.nr > b.nr).reverse()[0].nr) + 1
      }
      return Number(ultimulApAdaugat.nr) + 1
    },
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
    default: 2,
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
    type: 'number',
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
    id: 'contoare',
    type: 'contoare'
  },
  {
    id: 'incasari',
    type: 'array',
    notInForm: true,
    ref: 'incasari'
  },
  {
    id: 'datorii',
    type: 'array',
    notInForm: true,
    ref: 'cheltuieli'
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
