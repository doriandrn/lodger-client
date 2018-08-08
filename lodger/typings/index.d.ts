import { RxDocument, RxCollection } from 'rxdb'
import { Taxonomie, Config } from './defs'

interface LodgerPublicAPI {
  readonly asociatii: RxCollection<any>,
  readonly blocuri: RxCollection<any>,

  adauga(ce: Taxonomie, detalii: object): RxDocument<any>
}

interface LodgerInit {
  use (plugin: Plugin): boolean
  build (config: Config): LodgerPublicAPI
}

export {
  LodgerInit,
  LodgerPublicAPI
}
