<template lang="pug">
frm#single(
  v-if=     "doc.collection"
  :form=    "$lodger[plural].form"
  :value =  "docdata"
  :editing= "editing"
  :doc=     "doc"
  :i18n=    "$lodger.i18n.taxonomies[plural]"
  :isNew=   "doc._isTemporary"
  :refs=    "{ refs, crumbsIds: crumbsIds(true) }"
  @submit=  "submit"
)
  slot(
    slot=     "beforeHeader"
    :isNew=   "doc._isTemporary"
  )

  blocuri.struct(
    v-if=       "plural && plural === 'asociatii' && $lodger.blocuri.subscribers.single"
    layout=     "interactiv"
    :blocuri=   "doc._isTemporary ? null : $lodger.blocuri.subscribers.single.items"
  )
</template>

<script>
import field from 'form/field'
import dateTime from 'c/dateTime'
import frm from 'c/form'
import blocuri from 'c/blocuri'

import { Observer } from 'mobx-vue'
import { reaction, when } from 'mobx'

let disposer

export default Observer ({
  name: 'Single',
  data () {
    return {
      fetched: false,
      _sub: null,
      extraSubs: []
    }
  },
  props: {
    doc: {
      type: Object,
      default: null,
      required: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async submit (e) {
      const { $lodger, doc, taxonomy, debug, _sub } = this
      const { modal, mainSubName } = $lodger

      if (!doc._isTemporary)
        return

      Object.assign(doc, e)

      await doc.save(e);
      modal.closeable = true
      await modal.close()


      // if (modal.firstTime) {
      //   try {
      //     reaction(() => sub.ids, (ids) => {
      //       sub.select(ids[0])
      //     debug(`Selected ${ids[0]}, firstTime = off`)
      //     })

      //     debug(sub.ids[0])
      //   } catch (e) {
      //     debug('Could not select first time item', e)
      //   }
      //   modal.firstTime = false
      // }
    }
  },

  created () {
    const { $lodger, taxonomy, debug } = this
    const { modal, mainSubName } = $lodger
    const _sub = this._sub = $lodger[taxonomy].subscribers[mainSubName]
    const { firstTime } = modal

    if (firstTime) {
      disposer = when(() => _sub.ids.length > 0, () => {
        debug('fired')
        _sub.select(_sub.ids[0])
        modal.firstTime = false
      }, { fireImmediately: true })
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

    this.fetched = true
    return true
  },

  beforeDestroy () {
    const { extraSubs, debug, taxonomy } = this
    this.fetched = false
    if (extraSubs.length) {
      extraSubs.map(sub => { this.$lodger[sub].subscribers.single.kill(); delete this.$lodger[sub].subscribers.single })
    }
    if (disposer) {
      setTimeout(() => {
        debug('Cancelled -single- disposer', taxonomy )
        disposer()
      }, 2500);
    }
  },

  computed: {
    docdata () {
      return this.doc._data
    },
    plural () {
      return this.doc.collection.name.plural
    },
    refs () {
      const { form: { fieldsIds }} = this

      try {

        return [
          ...this.breadcrumbs
            .map(tax => this.$lodger[tax.plural].parents)
        ].reduce((a, taxes, i) => {
          const x = {}
          taxes.forEach(tax => {
            const { subscribers, data } = this.$lodger[tax.plural]
            const taxRelId = tax.plural === tax ? tax : `${tax}Id`

            // outside taxes not includeed in the form for no conflicts
            const { selectedId } = fieldsIds.indexOf(taxRelId) > -1 ?
              subscribers.single :
              subscribers.prince

            // const items = multiple ? selectedId.map(id => ) : data[selectedId]
            const pTax = this.breadcrumbs[i]

            // if (!item) {
            //   this.debug('Did not find item for refs in single', selectedId)
            // }
            x[pTax] = x[pTax] || {}
            x[pTax][taxRelId] = {
              [taxRelId.indexOf('Id') === taxRelId.length - 2 ? '$eq' : '$in']: typeof selectedId === 'string' && taxRelId.indexOf('Id') < 0 ? [selectedId] : selectedId
            }
          })

          return {
            ...a,
            ...x
          }
        }, {})
      } catch (e) {
        this.debug('QZF', e)
      }

    },
    crumbsIds () {
      const { doc, docdata: { _id } } = this
      if (!doc)
        return

      return (withSelf = true) => {
        const { name } = doc.collection.schema.jsonSchema
        return this.breadcrumbs.reduce((a, b) => ({
          ...a,
          [`${b}Id`]: this.docdata[`${b}Id`]
        }), withSelf ? { [`${ name }Id`]: _id } : {})
      }
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
      const { parents, form: { fields } } = $tax

      if (!parents || !parents.length) return []
      return parents.filter(parent => Object.keys(fields).indexOf(parent + 'Id') > - 1)
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

<style lang="stylus">
@require '~styles/config'


[data-type="dateTime"]
  grid-area metaL

  & + [data-type="dateTime"]
    grid-area metaR

[data-tax="utilizator"]
  fieldset.header
    .fields
      grid-template-areas:
        "avatar avatar name name name name"\
        "avatar avatar pin rol rol ."\
        "contact contact . . . ."\
        "metaL metaL . . metaR metaR"

    .codPIN
      grid-area pin

    .avatar
      grid-area avatar

      img
        size 100%

    .name
      grid-area name
      align-self flex-end

    .contact
      grid-area contact

    .rol
      grid-area rol

  form
    &.isNew
      .rol
        display none

[data-tax=  "cheltuiala"]
  .snapshotsApartamente
    display none

  #single
    .distribuire
      position relative

      header
        padding 0 !important
        display flex
        flex-flow row wrap

      &:before
        content ''
        position absolute 0
        z-index -1
        background rgba(black, .025)

    .ms
      +above(l)
        min-width 366px
        max-height 480px

      li
        &.selected
          .bani:not(.impartire)
            .conv
              color black

        &:not(.selected)
          > *
            color rgba(black, .6)

        .locatari
          width 48px
          margin-left 48px
          order 3

        .suprafata
          order 4

          em
            margin-left 2px
            font-style normal

        .impartire
          order 9

        .suprafata
        .locatari
          display inline-flex
          flex-flow row nowrap
          align-items baseline

          *:not(sup)
            vertical-align baseline

    [data-type="suprafata"]
      .distribuire
        .ms
          li.selected
            .suprafata
              color black

    [data-type="locatari"]
      .distribuire
        .ms
          li.selected
            .locatari
              color black

              &:before
                background-color black

  form.form
    &.isNew
      .progres
        display none

      fieldset.header
        .fields
          grid-template-areas:
            "aps aps"\
            "catre suma"\
            "distribuire scadenta"\
            "denumire denumire"\
            "atasamente atasamente"

          +above(m)
            grid-template-areas:
              "aps aps aps aps catre catre"\
              "aps aps aps aps suma suma"\
              "aps aps aps aps distribuire distribuire"\
              "aps aps aps aps scadenta scadenta"\
              "aps aps aps aps denumire denumire"\
              "atasamente atasamente atasamente atasamente atasamente atasamente"

          +above(l)
            grid-template-areas:
              "aps aps aps catre suma suma"\
              "aps aps aps distribuire distribuire distribuire"\
              "aps aps aps scadenta scadenta scadenta"\
              "aps aps aps denumire denumire denumire"\
              "atasamente atasamente atasamente atasamente atasamente atasamente"


          +above(xl)
            grid-template-areas:
              "aps aps aps catre catre suma"\
              "aps aps aps distribuire distribuire scadenta"\
              "aps aps aps denumire denumire denumire"\
              "aps aps aps atasamente atasamente atasamente"

    &:not(.isNew)
       fieldset.header
        .fields
          +above(l)
            grid-template-areas:
              "aps aps aps denumire denumire suma"\
              "aps aps aps catre catre progres"\
              "aps aps aps distribuire distribuire scadenta"\
              "aps aps aps metaL . metaR"\
              "aps aps aps atasamente atasamente atasamente"


  fieldset.header
    span[data-type]:not(.sort)
      padding 10px

      +above(m)
        padding 16px

      +above(l)
        padding 20px

      +above(xl)
        padding 24px

    .fields
      grid-column-gap 0 !important
      grid-row-gap 0 !important
      // +above(l)
      //   grid-column-gap 60px

      .asociatieId
        display none

      .modDistribuire
        grid-area distribuire

      .attachments
        margin-top auto
        grid-area atasamente

      .progres
        grid-area progres

      .catre
        grid-area catre
      .asociatieId
        grid-area denumire


      .denumire
        grid-area denumire

      .distribuire
        grid-area aps
        height 100%

      .suma
        grid-area suma

      .dataScadenta
        grid-area scadenta

        &.value
          time
            text-align right

            &::before
              content 'zz'

      .rel
        grid-area data

[data-tax="incasare"]
  fieldset.header
    .fields
      grid-template-areas:
        "nr deLa deLa deLa plata plata"\
        ". altele altele . plata plata"

    .apartamentId
      grid-area deLa

    .cheltuieli
      grid-area altele

    [data-type="number"]
      grid-area nr

    [data-type="$"]
      grid-area plata

[data-tax="apartament"]
  .etaj
    order 3

  .asociatieId
    order 0

  .blocId
    order 1

  .scara
    order 2
  fieldset.header
    .fields
      grid-template-areas:
        "nr proprietar proprietar . balanta balanta"\
        "servicii servicii servicii contoare contoare contoare"\
        "metaL metaL . . metaR metaR"

    [data-type="number"]
      grid-area nr

      input#nr
        font-size 20px

    [data-type="$"]
      grid-area balanta

    [data-type="taxonomy"]
      grid-area contoare

    [data-type="fullName"]
      grid-area proprietar

[data-tax="asociatie"]
  fieldset.header
    .fields
      grid-template-areas:
        "nume nume nume nume balanta balanta"\
        "servicii servicii servicii users users users"\
        "metaL metaL . . metaR metaR"

    [data-type="string"]
      grid-area nume

    [data-type="$"]
      grid-area balanta

    [data-type="taxonomy"]
      grid-area users

      &+[data-type="taxonomy"]
        grid-area servicii

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

  input#name
    font-size 22px
    line-height 24px

    +above(m)
      font-size 24px
      line-height 26px

    +above(l)
      font-size 28px
      line-height 36px

  > header
    border-bottom 1px solid

  /* .list - comentat, futte dropdownurile
    display flex
    flex-flow row-reverse nowrap */

  button.new
    size 40px
    line-height 40px
    border-radius 50px

  section
    /* &.main
      display grid
      grid-template-columns repeat(3, 1fr) */

    > div
      display flex
      flex-flow column-reverse nowrap
      padding 8px 0

      &:not(:first-child)
        border-top 1px solid rgba(black, .05)

      > span
        flex 1 1 100%

</style>
