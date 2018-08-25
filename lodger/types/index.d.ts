import { RxDocument, RxCollection } from 'rxdb'
import { Taxonomii } from 'lodger'

type GettersDBTaxonomii = {
  [k in Taxonomii]: () => RxCollection<any>
}


declare module "*.json" {
  const value: any;
  export default value;
}

declare class Lodger {
  [k: string]: RxDocument<any> | boolean | Promise<void> | GettersDBTaxonomii

  put(): RxDocument<any>
  trash(): boolean
  destroy(): Promise<void>
}

declare global {
  interface RootState {
    version: string
  }
}
