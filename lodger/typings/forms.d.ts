import { Plural } from './defs'
import { RxJsonSchema, RxCollectionCreator } from 'rxdb'

type Strings = 'text' | 'textarea' | 'select' | 'search' | 'string' | undefined
type Numbers = 'number' | 'date-time' | 'bani' | 'date'
type Arrays = 'array' | 'scari' | 'contactFields' | Taxonomie

type KnownItemTypes = Strings | Numbers | Arrays
type cheiImutabile = 'primary' | 'index' | 'encrypted' | 'required'

type ItemName = string

type RxDBType = 'string' | 'number' | 'array'
type ItemReference = Plural<Taxonomie> | object

type Item = {
  id: string,
  name?: ItemName,
  step?: number,
  index?: boolean,
  type?: KnownItemTypes,
  ref?: ItemReference,
  items?: object,
  indexRef?: boolean,
  required?: boolean,
  encrypted?: boolean,
  notInDb?: boolean
}

type Fields = Item[]
type FormName = string
type FormMethods = Function[]

export interface LodgerForm {
  name: FormName
  plural: Plural
  fields: Fields
  methods?: FormMethods
  sync?: boolean
}

type ExcludedOverwrites = 'properties' | 'required' | 'title' | 'compoundIndexes'
export type AllowedSchemaOverwrites = Without<RxJsonSchema, ExcludedOverwrites>
