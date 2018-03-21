export default {
  dashboard: {
    title: 'Panou de control',
    actions: {
      title: 'Acțiuni',
      cashIn: 'Încasează',
      spend: 'Adaugă o cheltuială'
    },
    statistics: {
      title: 'Statistici',
      earnings: 'Încasări'
    },
    activity: {
      title: 'Activitate'
    }
  },
  navigation: ['Panou de Control', 'Liste de plată', 'Comunitate'],
  asociatie: {
    noneAdmind: {
      heading: 'Nu administrezi nicio asociație',
      CTA: 'Începe prin a-ți configura prima asociație',
      action: 'Adaugă o asociație'
    },
    new: {
      title: 'Asociație nouă',
      name: 'Denumire',
      idN: 'CIF',
      confirmStruct: 'Structura este finală'
    },
    init: {
      title: 'Inițializare',
      structura: 'Structură',
      serviciiFurnizori: 'Servicii & Furnizori',
      financiar: 'Date financiare',
      balanta: 'Balanța casei la data preluării',
      dataDinLuna: 'Data din lună la care se generează listele de plată'
    },
    adminZone: {
      title: 'Zonă administrativă',
      modify: 'Modifică datele asociației',
      delete: 'Șterge asociația',
      deletePrompt: 'Ești sigur că dorești să ștergi asociația [X]?',
      dangerZone: 'Zona periculoasă'
    }
  },
  blocs: {
    none: {
      heading: 'Asociație neinițializată',
      CTA: 'Începe prin a-ți inițializa și configura asociația pe care o administrezi.',
      actions: ['Inițializează manual', 'Importă datele din altă aplicație']
    },
    new: {
      title: 'Adaugă un bloc/o clădire nou(ă)',
      name: 'Identificator / Denumire'
    },
    edit: {
      title: 'Modifică blocul [X]'
    },
    delete: 'Șterge blocul',
    etaje: 'Etaje',
    etaj: 'Etaj',
    parter: 'Parter',
    scari: 'Scări'
  },
  aps: {
    new: {
      title: 'Adaugă apartament'
    },
    edit: {
      title: 'Modifică apartamentul [X]'
    }
  },
  incasare: {
    new: {
      dela: 'De la',
      title: 'Încasează',
      nr: 'Nr. Chitanță'
    }
  },
  defaults: {
    address: 'Adresă',
    prompt: {
      message: 'Ești sigur?',
      confirm: 'Da',
      cancel: 'Nu chiar'
    },
    forms: {
      add: 'Adaugă',
      edit: 'Modifică'
    }
  },
  search: 'Caută',
  sum: 'Suma'
}
