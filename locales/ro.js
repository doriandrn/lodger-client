import { P } from "glamorous";

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
    edit: {
      title: 'Modifică datele asociației'
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
  bloc: {
    none: {
      heading: 'Asociație neinițializată',
      CTA: 'Începe prin a-ți inițializa și configura asociația pe care o administrezi.',
      actions: ['Inițializează manual', 'Importă datele din altă aplicație']
    },
    new: {
      title: 'Adaugă un bloc/o clădire nou(ă)',
      nume: 'Identificator / Denumire',
      scariCount: 'Nr. scări (dacă există)',
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
    parter: 'Parter',
    scara: 'Scară',
    scari: 'Scări'
  },
  apartament: {
    new: {
      title: 'Adaugă apartament',
      nr: 'Nr.',
      suprafata: 'Suprafață',
      proprietar: 'Proprietar',
      locatari:'Nr. Locatari',
      balanta: 'Restant la zi',
      utilitati: 'Utilități'
    },
    edit: {
      title: 'Modifică apartamentul'
    },
    inexistent: {
      heading: 'Apartament inexistent',
      mesaj: 'Acest apartament, fie că a fost șters sau niciodata creat, nu există...',
      actiuni: ['Încearcă recuperarea lui', 'Mergi la panoul de control', 'Adaugă un apartament']
    }
  },
  incasare: {
    new: {
      dela: 'De la',
      title: 'Încasează',
      nr: 'Nr. Chitanță'
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
      denumire: 'Denumire'
    },
    edit: {
      title: 'Modifică serviciul'
    },
    modifica: 'Modifică serviciul',
    sterge: 'Elimină serviciul',
    deletePrompt: 'Ești sigur(ă) că vrei să elimini acest serviciu din listă?',
    adauga: 'Adaugă serviciu',
    notFoundToBeDeleted: 'A apărut o problemă la ștergerea serviciului. Te rugăm să reîncerci.'
  },
  registru: {
    title: 'Registru de plăți și încasări',
    cheltuieli: 'Cheltuieli',
    incasari: 'Încasări'
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
