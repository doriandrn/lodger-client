///<reference path="main.d.ts" />
import { RxJsonSchema, RxCollectionCreator } from 'rxdb'
import { Taxonomii } from 'lodger/index'

type Strings = 'text' | 'textarea' | 'select' | 'search' | 'string' | undefined
type Numbers = 'number' | 'date-time' | 'bani' | 'date'
type Arrays = 'array' | 'scari' | 'contactFields' | Taxonomii

type KnownItemTypes = Strings | Numbers | Arrays
type cheiImutabile = 'primary' | 'index' | 'encrypted' | 'required'

type ItemName = string

type RxDBType = 'string' | 'number' | 'array' | 'object'
type ItemReference = Plural | object

type Item = {
  id: string,
  name?: ItemName,
  label?: string

  type?: KnownItemTypes,
  required?: boolean,
  encrypted?: boolean,
  
  default?: any
  value?: any

  step?: number,
  index?: boolean,
  ref?: ItemReference,
  items?: object,
  indexRef?: boolean,

  notInDb?: boolean
  notInForm?: boolean
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
