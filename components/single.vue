<template lang="pug">
ul#single.accordion
  li
    frm(
      :form=    "$lodger[plural].form"
      :value =  "docdata"
      :doc=     "doc"
      :i18n=    "$lodger.i18n.taxonomies[plural]"
      :isNew=   "doc._isTemporary"
      @submit=  "doc.save($event); $lodger.modal.close()"
    )
      dateTime(
        v-if=       "!doc._isTemporary"
        :unixTime=  "createdAt"
        slot=       "headerEnd"
        liveUpdate
      )

      blocuri.struct(
        v-if=       "plural && plural === 'asociatii' && $lodger.blocuri.subscribers.single"
        layout=     "interactiv"
        :blocuri=   "$lodger.blocuri.subscribers.single.items"
      )
</template>

<script>
import field from 'form/field'
import dateTime from 'c/dateTime'
import frm from 'c/form'
import blocuri from 'c/blocuri'

import { Observer } from 'mobx-vue'

export default Observer ({
  data () {
    return {
      fetched: false,
      extraSubs: []
    }
  },
  props: {
    doc: {
      type: Object,
      default: null,
      required: true
    }
  },
  async fetch () {
    const { plural, fetched, docdata } = this
    if (fetched) return
    const id = docdata._id

    if (plural === 'asociatii') {
      const criteria = { filter: { asociatieId: id }, limit: 0 }
      const sub = this.$lodger.blocuri.subscribers.single

      if (sub) {
        sub.criteria = criteria
      } else {
        this.$lodger.blocuri.subscribe('single', { criteria })
        this.extraSubs.push['blocuri']
      }
    }

    // const o = {
    //   asociatii: async () => {



    //   }
    // }

    // if (o[plural]) await o[plural]()

    // const fields = Object.keys(docdata)

    // await Promise.all(fields.map(async f => {
    //   if (this.$lodger.taxonomies.indexOf(f) > 1) {
    //     this.docdata[f] = await this.doc[`${f}_`]
    //   }
    // }))

    this.fetched = true
    return true
  },

  beforeDestroy () {
    const { extraSubs } = this
    this.fetched = false
    if (extraSubs.length) {
      extraSubs.map(sub => { this.$lodger[sub].subscribers.single.kill(); delete this.$lodger[sub].subscribers.single })
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
      if (!_id) return // temp docs
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
    dateTime,
    blocuri
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
