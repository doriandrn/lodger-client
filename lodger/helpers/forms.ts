import { RxSchema } from 'rxdb'
// import { FormData } from '../typings/forms'

export class Form {
  name: string
  constructor(formName: string) {
    this.name = formName
  }
  toRxSchema(this: Form): RxSchema {

  }
}


// const asociatiiSchema = asociatii.toRxSchema()