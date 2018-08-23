import { RxDocument, RxCollection } from 'rxdb'
import { Taxonomii } from 'lodger'

type GettersDBTaxonomii = {
  [k in Taxonomii]: () => RxCollection<any>
}


declare module "*.json" {
  const value: any;
  export default value;
}

declare global {
  interface Lodger {
    [k: string]: RxDocument<any> | boolean | Promise<void> | GettersDBTaxonomii

    put (): RxDocument<any>
    trash (): boolean
    destroy (): Promise<void>
  }

  interface RootState {
    version: string
  }
}

export {
  Lodger
}
