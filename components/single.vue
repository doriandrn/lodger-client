<template lang="pug">
#single
  header
    ul.breadcrumbs(v-if="asAccordion")
      li(v-for="b in breadcrumbs" @click="$emit('focus', { b })") {{ b }}

    field(
      v-for=    "field in previewFields",
      :id=      "field",
      :key=     "field"
      :label =  "field"
      :value=   "docdata[field] || form.fields[field].default"
      :required = "schema.required.indexOf(field) > -1"
      :hideLabel = "true"
      :disabled="!editable"
      :type=    "$lodger.taxonomies.indexOf(field) > -1 ? 'taxonomy' : (schema.properties[field]._type || 'string')"
    )

    dateTime(:datetime= "createdAt")

  section.tabs tabs

  section.main(v-if= "docdata")
    field(
      v-for=    "field in fields",
      :id=      "field",
      :key=     "field"
      :label =  "field"
      :disabled="!editable"
      :value=   "docdata[field] || form.fields[field].default"
      :required = "schema.required.indexOf(field) > -1"
      :type=    "$lodger.taxonomies.indexOf(field) > -1 ? 'taxonomy' : (schema.properties[field]._type || 'string')"
    )

  footer.actions
    button trash
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
    },
    editable: {
      type: Boolean,
      default: false
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
      return Object.keys(this.docdata).filter(k => k.indexOf('_') !== 0 && this.previewFields.indexOf(k) === -1)
    },
    createdAt () {
      const { _id }  = this.docdata
      return _id.split(':')[1]
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
      return parents.filter(parent => this.fields.indexOf(parent + 'Id') > - 1)
    },
    previewFields () {
      return this.form.previewFields
    },

    asAccordion () {
      return this.breadcrumbs && this.breadcrumbs.length
    }
  },
  components: {
    field,
    dateTime
  }
}
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
