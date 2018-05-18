export const campuri = [
  {
    id: '_id',
    notInDb: true, // skip it's already defiend by rxdb
    notInForm: true,
    value: getters => getters['apartament/selectat']._id
  },
  {
    id: 'nr',
    type: 'number',
    default: getters => {
      const bloc = getters['etaj/selectat'].bloc

      if (!bloc) return 1
      const ultimulApAdaugat = getters['apartament/ultim']
      console.log('UA', ultimulApAdaugat)
      if (!ultimulApAdaugat || bloc !== ultimulApAdaugat.bloc) {
        const apsBloc = Object.values(getters.apartamente).filter(ap => ap.bloc === bloc)
        if (!apsBloc || !apsBloc.length) return 1
        return Number(apsBloc.sort((a, b) => a.nr > b.nr).reverse()[0].nr) + 1
      }
      return Number(ultimulApAdaugat.nr) + 1
    },
    value: getters => getters['apartament/selectat'].nr,
    required: true
  },
  {
    id: 'suprafata',
    type: 'number',
    default: null,
    step: 0.01,
    value: getters => getters['apartament/selectat'].suprafata
  },
  {
    id: 'locatari',
    type: 'number',
    default: 2,
    min: 0,
    max: 10,
    value: getters => getters['apartament/selectat'].locatari
  },
  {
    id: 'camere',
    type: 'number',
    default: 2,
    max: 12,
    min: 1,
    value: getters => getters['apartament/selectat'].camere
  },
  {
    id: 'proprietar',
    placeholder: 'Ion Barbu',
    value: getters => getters['apartament/selectat'].proprietar
  },
  {
    id: 'etaj',
    type: 'number',
    required: true,
    notInForm: true,
    default: getters => getters['etaj/selectat'].etaj,
    value: getters => getters['apartament/selectat'].etaj
  },
  {
    id: 'bloc',
    required: true,
    notInForm: true,
    default: getters => getters['etaj/selectat'].bloc,
    value: getters => getters['apartament/selectat'].bloc
  },
  {
    id: 'scara',
    type: 'number',
    required: true,
    notInForm: true,
    default: getters => getters['etaj/selectat'].scara,
    value: getters => getters['apartament/selectat'].scara
  },
  {
    id: 'balanta',
    type: 'bani',
    default: null,
    value: getters => getters['apartament/selectat'].balanta
  },
  {
    id: 'contoare',
    type: 'contoare',
    value: getters => getters['apartament/selectat'].contoare
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
