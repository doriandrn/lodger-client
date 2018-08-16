import { RxDocument, RxCollection } from 'rxdb'
import { BuildOptions, Asociatii } from './defs'
import { Taxonomie } from '../index'

type ItemId = string

interface Lodger {
  put (): RxDocument<any>
  trash (): boolean
  
  destroy (): Promise<void>
  // [k: string]: RxCollection<any>

  // asociatii (): Getter<Asociatii>
}

// interface LodgerInit {
//   build (options?: BuildOptions): LodgerPublicAPI
//   use (plugin: Plugin): boolean
// }

interface RootState {
  version: string
}

export {
  Lodger,
  // LodgerPublicAPI,
  RootState
}
