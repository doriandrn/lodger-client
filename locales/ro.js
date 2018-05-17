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
  navigation: [
    'Panou de Control',
    'Liste de plată',
    'Comunitate'
  ],
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
      confirmStruct: 'Structura este finală',
      continuaInitializarea: 'Continuă inițializarea'
    },
    adaugat: {
      h: 'Asociație adaugată!'
    },
    edit: {
      title: 'Modifică datele asociației'
    },
    init: {
      title: 'Inițializare',
      start: {
        titlu: 'Asociație neiniațializată',
        mesaj: 'Începe inițializarea'
      },
      servicii: {
        titlu: 'Servicii & contoare',
        mesaj: 'Alege serviciile furnizate de asociația ta'
      },
      furnizori: {
        titlu: 'Furnizori',
        mesaj: 'Definește furnizorii pentru serviciile alese anterior'
      },
      structura: {
        titlu: 'Structură',
        mesaj: 'Continuă cu definirea structurii blocurilor și apartamentelor'
      },
      financiar: {
        titlu: 'Date financiare',
        mesaj: 'Financiare'
      },
      balanta: 'Balanța casei la data preluării',
      dataDinLuna: 'Data din lună la care se generează listele de plată'
    },
    setari: {
      title: 'Zonă administrativă',
      backupDb: 'Exportă / Salvează datele asociației',
      importDb: 'Importă datele asociației',
      modify: 'Modifică datele asociației',
      sterge: 'Șterge asociația',
      stergePrompt: 'Ești sigur că dorești să ștergi asociația [X]?',
      periculoase: {
        titlu: 'Zona periculoasă'
      },
      date: {
        titlu: 'Bază de date',
        desc: 'Exportă / importă datele asociației'
      },
      default: {
        titlu: 'Bazice'
      }
    }
  },
  bloc: {
    none: {
      heading: 'Definește structura imobilelor',
      CTA: 'Următorul pas constă în definirea structurii apartamentelor',
      actions: ['Adaugă un bloc', 'Importă datele din altă aplicație'],
    },
    new: {
      title: 'Adaugă un bloc/o clădire nou(ă)',
      nume: 'Identificator / Denumire',
      adresa: 'Adresă',
      scariCount: 'Nr. scări',
      scari: 'Structura scărilor'
    },
    edit: {
      title: 'Modifică blocul'
    },
    anterior: 'Blocul anterior',
    urmator: 'Blocul următor',
    delete: 'Șterge blocul',
    etaje: 'Etaje',
    etaj: 'Etaj',
    etajul: 'Etajul',
    parter: 'Parter',
    scara: 'Scară',
    scari: 'Scări'
  },
  utilizator: {
    new: {
      nume: 'Nume complet',
      emailPublic: 'E-mail public',
      alteDetaliiContact: 'Alte detalii de contact'
    },
    setari: {
      online: {
        titlu: 'Cont online',
        desc: 'Opțional, poți accesa datele tale de pe alt dispozitiv. Conectează acest cont.'
      },
      default: {
        titlu: 'Profil public',
        desc: ''
      }
    }
  },
  cheltuiala: {
    new: {
      title: 'Cheltuială nouă',
      catre: 'Către',
      modDistribuire: 'Mod de distribuire',
      apartamenteEligibile: 'Apartamente eligibile',
      suma: 'Suma',
      dataScadenta: 'Scadentă la'
    }
  },
  apartament: {
    new: {
      title: 'Adaugă apartament',
      nr: 'Nr.',
      suprafata: 'Suprafață',
      proprietar: 'Proprietar',
      locatari:'Nr. Locatari',
      balanta: 'Restant la zi',
      utilitati: 'Utilități',
      contoare: 'Contoare',
      camere: 'Camere',
    },
    edit: {
      title: 'Modifică apartamentul'
    },
    inexistent: {
      heading: 'Apartament inexistent',
      mesaj: 'Acest apartament, fie că a fost șters sau niciodata creat, nu există...',
      actiuni: ['Încearcă recuperarea lui', 'Mergi la panoul de control', 'Adaugă un apartament']
    },
    adaugat: {
      h: 'Apartament adăugat!',
      p: 'Apartamentul [nume] a fost adăugat la blocul asta! bla balbalbla lbal blalbalblalb alb lalb alblalblal bla.'
    },
    updatat: {
      h: 'Apartament actualizat!'
    }
  },
  incasare: {
    new: {
      deLa: 'De la',
      title: 'Încasează',
      nrChitanta: 'Nr. Chitanță'
    },
    adaugat: {
      h: 'Încasat!'
    }
  },
  furnizor: {
    new: {
      title: 'Adaugă furnizor',
      nume: 'Nume / Denumire Societate',
      servicii: 'Pentru',
      idN: 'CIF'
    }
  },
  serviciu: {
    new: {
      title: 'Adaugă un serviciu',
      denumire: 'Denumire',
      contoare: 'Contorizare'
    },
    edit: {
      title: 'Modifică serviciul'
    },
    modifica: 'Modifică serviciul',
    sterge: 'Elimină serviciul',
    deletePrompt: 'Ești sigur(ă) că vrei să elimini acest serviciu din listă?',
    adauga: 'Adaugă serviciu',
    notFoundToBeDeleted: 'A apărut o problemă la ștergerea serviciului. Te rugăm să reîncerci.',
    nume: {
      'evacuare-gunoi-menajer': 'Salubritate',
      internet: 'Internet',
      apa: 'Apă',
      gaze: 'Gaze',
      electricitate: 'Electricitate',
      termoficare: 'Termoficare'
    }
  },
  registru: {
    title: 'Registru de plăți și încasări',
    cheltuieli: 'Cheltuieli',
    incasari: 'Încasări'
  },
  defaults: {
    address: 'Adresă',
    asociatie: 'Asociație',
    asociatia: 'Asociația de locatari',
    feedback: 'Reacționează!',
    prompt: {
      message: 'Ești sigur?',
      confirm: 'Șterge',
      cancel: 'Nu chiar'
    },
    forms: {
      add: 'Adaugă',
      edit: 'Modifică'
    },
    user: {
      profile: 'Profil'
    },
    add: 'Adaugă',
    optional: 'opțional',
    search: 'Caută',
    sum: 'Suma',
    settings: 'Setări'
  },
  scara: {
    _articulat: 'Scara',
    new: {
      name: 'Id'
    },
    lift: 'Ascensor',
    mansarda: 'Mansardă'
  },
  erori: {
    'Error': 'Ne pare rău, a apărut o eroare :(',
    '404': 'Această resursă este inaccesibilă',
    '500': 'Eroare de server',
    'TypeError': 'Dorian, învață să programezi!!',
    'ReferenceError': 'Dorian, învață să programezi!!',
    'inContinuare': 'Alege ce dorești să faci în continuare'
  },
  sort: {
    label: 'Sortează după',
    la: 'Data încasării / cheltuielii',
    suma: 'Valoarea tranzacției',
    nrChitanta: 'Numărul chitanței'
  },
  feedback: {
    new: {
      title: 'Feedback',
      tip: 'Tip',
      mesaj: 'Mesaj',
      subiect: 'Subiect'
    }
  }
}
