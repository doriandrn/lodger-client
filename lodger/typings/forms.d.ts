import { Taxonomie } from './defs'
import { RxJsonSchema } from 'rxdb'

type Strings = 'text' | 'textarea' | 'select' | 'search' | 'string' | undefined
type Numbers = 'number' | 'date-time' | 'bani' | 'date'
type Arrays = 'array' | 'scari' | 'contactFields' | Taxonomie

type KnownItemTypes = Strings | Numbers | Arrays
type cheiImutabile = 'primary' | 'index' | 'encrypted' | 'required'

type ItemName = string

type RxDBType = 'string' | 'number' | 'array'
type ItemReference = Taxonomie | object

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

export type FormData = {
  readonly name: FormName
  readonly fields: Fields
  readonly methods?: FormMethods
}

type ExcludedOverwrites = 'properties' | 'required' | 'title' | 'compoundIndexes'
export type AllowedSchemaOverwrites = Without<RxJsonSchema, ExcludedOverwrites>
