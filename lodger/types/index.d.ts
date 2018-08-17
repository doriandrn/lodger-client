import { RxDocument, RxCollection } from 'rxdb'
import { Taxonomii } from 'lodger'

type GettersDBTaxonomii = {
  [k in Taxonomii]: () => RxCollection<any>
}

declare global {
  interface Lodger {
    [k: string]: RxDocument<any> | boolean | Promise<void> | GettersDBTaxonomii

    put (): RxDocument<any>
    trash (): boolean
    destroy (): Promise<void>
  }
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
  RootState
}
