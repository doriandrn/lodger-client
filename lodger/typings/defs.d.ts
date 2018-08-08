import { RxDatabase, RxDatabaseCreator } from "rxdb"
import { Form } from 'lodger/lib/Form'

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

export type CriteriuGetterTaxonomie = string | object | null

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
  modules?: Module[]
}

type ConstructContext = {
  db: RxDatabase,
  forms: Form[],
  [key: string]: any
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

interface Apartament {}

type Asociatii = Array<Asociatie>

declare enum Languages {
  en,
  ro
}

interface UserPreferences {
  language: Languages
}

interface ClientPreferences extends UserPreferences {}

interface Preferences {
  client: ClientPreferences,
  user: UserPreferences,
}

// type Taxonomie = 'asociatie' | 'bloc' | 'apartament' | 'incasare' | 'cheltuiala'

// const enum Taxonomie {
//   Asociatii,
// }
