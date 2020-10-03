<template lang="pug">
ul#single.accordion
  li
    frm(
      :form=    "$lodger[plural].form"
      :value =  "docdata"
      :doc=     "doc"
      :i18n=    "$lodger.i18n.taxonomies[plural]"
    )
      dateTime(
        :unixTime=  "createdAt"
        slot=       "headerEnd"
        liveUpdate
      )

  //- header
  //-   ul.breadcrumbs(v-if="asAccordion")
  //-     li(v-for="b in breadcrumbs" @click="$emit('focus', { b })") {{ b }}

  //-   field(
  //-     v-for=      "field in previewFields",
  //-     :id=        "field",
  //-     :key=       "field"
  //-     :label =    "field"
  //-     :value=     "doc._data[field] || form.fields[field].default"
  //-     :required = "schema.required.indexOf(field) > -1"
  //-     :hideLabel = "true"
  //-     :disabled=  "!editable"
  //-     :type=      "$lodger.taxonomies.indexOf(field) > -1 ? 'taxonomy' : (schema.properties[field]._type || 'string')"
  //-     @input=     "doc.atomicSet(field, $event)"
  //-   )





  //- section.main(v-if= "docdata")
  //-   field(
  //-     v-for=      "field in fields",
  //-     :id=        "field",
  //-     :key=       "field"
  //-     :label =    "field"
  //-     :disabled=  "!editable"
  //-     :value=     "docdata[field] || form.fields[field].default"
  //-     :required = "schema.required.indexOf(field) > -1"
  //-     :type=      "$lodger.taxonomies.indexOf(field) > -1 ? 'taxonomy' : (schema.properties[field]._type || 'string')"
  //-   )

</template>

<script>
import field from 'form/field'
import dateTime from 'c/dateTime'
import frm from 'c/form'

import { Observer } from 'mobx-vue'

export default Observer ({
  data () {
    return {
      fetched: false
    }
  },
  props: {
    // taxonomy: {
    //   type: String
    // },
    // id: {
    //   type: String,
    //   required: true
    // },
    doc: {
      type: Object,
      default: null,
      required: true
    }
  },
  // async fetch () {
  //   // populate fields
  //   if (this.fetched) return
  //   const fields = Object.keys(this.docdata)

  //   await Promise.all(fields.map(async f => {
  //     if (this.$lodger.taxonomies.indexOf(f) > 1) {
  //       this.docdata[f] = await this.doc[`${f}_`]
  //     }
  //   }))

  //   this.fetched = true

  //   return true
  // },

  computed: {
    docdata () {
      return this.doc._data
    },
    plural () {
      return this.doc.collection.name.plural
    },
    fields () {
      return Object.keys(this.docdata).filter(k => k.indexOf('_') !== 0 && this.previewFields.indexOf(k) === -1)
    },
    createdAt () {
      const { _id }  = this.docdata
      return Number(_id.split(':')[1])
    },
    taxonomy () {
      return this.doc.collection.name.plural
    },
    form () {
      return this.$lodger[this.taxonomy].form
    },
    schema () {
      return this.form.schema
    },
    breadcrumbs () {
      const $tax = this.$lodger[this.taxonomy]
      const { parents } = $tax
      if (!parents || !parents.length) return
      return parents.filter(parent => this.fields.indexOf(parent + 'Id') > - 1).push('current')
    },
    previewFields () {
      return this.form.previewFields
    },

    asAccordion () {
      return this.breadcrumbs && this.breadcrumbs.length
    }
  },
  components: {
    frm,
    field,
    dateTime
  }
})
</script>

<style lang="styl">
.breadcrumbs
  position absolute
  top -100px
  left 0
  padding 0
  width 100%

  li
    background rgba(black, .05)
    line-height 20px
    padding 12px

#single
  padding 0
  width 100%

  > header
    border-bottom 1px solid

  .list
    display flex
    flex-flow row-reverse nowrap

  button.new
    size 40px
    line-height 40px
    border-radius 50px

  section
    &.main
      display grid
      grid-template-columns repeat(3, 1fr)

    > div
      display flex
      flex-flow column-reverse nowrap
      padding 8px 0

      &:not(:first-child)
        border-top 1px solid rgba(black, .05)

      > span
        flex 1 1 100%
</style>
