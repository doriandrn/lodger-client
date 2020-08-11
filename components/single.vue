<template lang="pug">
#single
  details
    dateTime(:datetime= "createdAt")

  div(v-if="docdata" v-for="field in fields")
    field(
      :id=      "field",
      :key=     "field"
      :label =  "field"
      :value=   "docdata[field]"
      :required = "schema.required.indexOf(field) > -1"
      :type= "$lodger.taxonomies.indexOf(field) > -1 ? 'taxonomy' : schema.properties[field].type"
    )
</template>

<script>
import field from 'form/field'
import dateTime from 'c/dateTime'

export default {
  data () {
    return {
      docdata: { ...this.doc._data },
      fetched: false
    }
  },
  props: {
    doc: {
      type: Object,
      default: null
    }
  },
  async fetch () {
    if (this.fetched) return
    const fields = Object.keys(this.doc._data)

    await Promise.all(fields.map(async f => {
      if (this.$lodger.taxonomies.indexOf(f) > 1) {
        this.docdata[f] = await this.doc[`${f}_`]
      }
    }))

    this.fetched = true

    return true
  },
  computed: {
    fields () {
      return Object.keys(this.docdata).filter(k => k.indexOf('_') !== 0)
    },
    createdAt () {
      const { _id }  = this.docdata
      return _id.split(':')[1]
    },
    schema () {
      return this.$lodger[this.doc.collection.name.plural].form.schema
    }
  },
  components: {
    field,
    dateTime
  }
}
</script>
