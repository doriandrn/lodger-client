import { RxDocument, RxCollection } from 'rxdb'
import { Taxonomie, Config } from './defs'

export declare interface LodgerPublicAPI {
  readonly asociatii: RxCollection<any>,
  readonly blocuri: RxCollection<any>,

  adauga(ce: Taxonomie, detalii: object): RxDocument<any>
}

export declare interface LodgerInit {
  use(plugin: Plugin): void
  build(config: Config): LodgerPublicAPI
}
