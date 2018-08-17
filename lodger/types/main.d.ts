import { RxDatabase, RxDatabaseCreator, RxCollection, RxCollectionCreator } from "rxdb"
import { Form } from 'lodger/lib/Form'
import { Store } from 'vuex'
import { RootState } from 'lodger/types'

declare global {
  // type Taxonomie = 'asociatie' | 'bloc' | 'apartament' | 'incasare' | 'cheltuiala'

  type ItemID = string | null

  type Organizatie = {
    nume: string,
    cif?: number,
    rocif?: boolean
  }

  type Social = {
    retea: string,
    username: string
  }

  export type Singular = string
  export type Plural = string

  export type CriteriuGetterTaxonomii = string | object | null

  type DateContact = {
    emailPublic?: string,
    telefonPublic?: string,
    alteEmailuri: [string],
    alteTelefoane?: [string],
    sociale?: [Social]
  }

  type Bani = number


  type LodgerSchema = {
    
  }

  type Module = {
    name: string
  }

  type BuildOptions = {
    dbCon: RxDatabaseCreator,
    usePersistedState?: boolean
    modules?: Module[]
  }

  interface Plugin {
    name: string
  }

  interface Incasare {

  }

  type DistribuirePeApartamente = object

  type Distribuire = {
    mod: DistribuirePeApartamente,
    apartamente: Apartament[]
  }

  interface Cheltuiala {
    catre: Furnizor,
    suma: Bani,
    dataScadenta: Date,
    distribuire: Distribuire
  }

  interface Contor {

  }

  type PreferinteUtilizator = JSON | object | null

  interface Utilizator {
    _id: string,
    nume?: string,
    contact?: DateContact,
    preferinte?: PreferinteUtilizator
  }

  interface Furnizor {
    nume: string,
    organizatie?: Organizatie
  }

  type Serviciu = {
    denumire: string,
    furnizori: [Furnizor],
    contoare: [Contor]
  }

  type Tranzactie = [Incasare & Cheltuiala]

  interface Asociatie {
    _id: string,
    name: string,
    organizatie?: Organizatie,
    // administratori: [Utilizator],
    utilizatori?: [Utilizator],
    servicii: [Serviciu],
    furnizori?: [Furnizor],
    tranzactii?: [Incasare | Cheltuiala]
  }

  interface Apartament {
    _id: string
  }

  type Asociatii = Array<Asociatie>

  enum Languages {
    en,
    ro
  }

  interface UserPreferences {
    language: Languages
  }

  interface Preferences {
    client: ClientPreferences,
    user: UserPreferences,
  }

  type PluralsMap = Map<Singular, Plural>

  type DateTaxonomie = Asociatie | Apartament

  type ClientPreferences = {
    
  }
}
