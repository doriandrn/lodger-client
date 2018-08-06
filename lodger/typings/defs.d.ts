import { RxDatabase } from "rxdb"
import { DBConfig } from 'lodger/typings/lib/DB'
import { Collection } from 'lodger/lib/Collection'

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

type Config = {
  dbCon: DBConfig
  collections: Collection[]
}

type ConstructContext = {
  _db: RxDatabase
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

declare enum Taxonomii {
  Asociatii = 'asociatie',
  Blocuri,
  Apartamente,
  Incasari,
  Cheltuieli
}

type Taxonomie = 'asociatie' | 'bloc' | 'apartament' | 'incasare' | 'cheltuiala'

// const enum Taxonomie {
//   Asociatii,
// }
