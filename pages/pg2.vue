<template lang="pug">
sction#pg(boxes)
  list(
    v-for=        "tax in $lodger.taxonomies"
    v-if=         "!$lodger[tax].parents || $lodger[tax].parents && $lodger[tax].form.schema.required.filter(p => $lodger[tax].parents.indexOf(taxAsPlural(p)) > -1)"
    :key=         "tax"
    :taxonomy=    "$lodger[tax]"
    :subscriberName=  "subscriberName"
    :data-tax=  "tax"
  )
    header(slot-scope="{ taxonomy, subscriber }")
      h3 {{ $lodger.i18n.taxonomies[taxonomy.plural] ? $lodger.i18n.taxonomies[taxonomy.plural].plural : taxonomy.plural }}
        small(v-if="taxonomy.totals") {{ subscriber.ids.length }} / {{ taxonomy.totals }}
      button.new(
        @click="taxonomy.put(Object.assign({}, taxonomy.form.fakeData, refsIds(taxonomy)))"
      ) +

      field.sort(
        v-if=     "subscriber && subscriber.ids.length > 1"
        type=     "radios"
        label=    "sort.label"
        v-model=  "subscriber.criteria.sort"
        :id=       "`sort-${ subscriber.name }`"
        :options=  "Object.assign({}, ...taxonomy.form.schema.indexes.map(n => ({ [n] : 0 })) )"
        required= true
        :class=     "{ reverseActive: subscriber.criteria && subscriber.criteria.sort && subscriber.criteria.sort.direction < 1 }"
        @click=    "subscriber.criteria.sort = $event.checked ? { [$event.index]: -1 } : subscriber.criteria.sort"
      )

    li(
      slot= "item"
      slot-scope="{ item, subscriber, taxonomy }"
      :class= "{ last: taxonomy && item._id === taxonomy.lastItems[0], selected: taxonomy && String(taxonomy.subscribers[subscriberName].selectedId).indexOf(item._id) > -1 }"
      @click="subscriber.select(item[subscriber.primaryPath])"
    )
      viw(
        v-for=  "key, i in taxonomy.form.previewFields.filter(f => f.indexOf('Id') !== f.length - 2)"
        :type=  "key",
        :key=   "key",
        :value= "['suma', 'balanta'].indexOf(key) > -1 ? { suma: item[key], moneda: item.moneda } : item[key]"
        @click= "subscriber.edit(item[subscriber.primaryPath])"
      )
      //- :href="`${ $lodger[tax].name }/${ item[subscriber.primaryPath] }`"
      //- a( @click="subscriber.edit(item[subscriber.primaryPath])") {{ item[taxonomy.form.previewFields[0]] }}
      //- span(v-for="field, i in taxonomy.form.previewFields" v-if="i > 0") {{ item[field] }}
      //- //- a(href='' @click="openModal({ id: item[subscriber.primaryPath], tax: $lodger[tax].form.plural })") {{ item.name }}
  //- @new=         "openModal(`${tax}.new`)"
  //- @edit=        "openModal({ id: `${tax}.edit`, data: $event })"
  //- :items=       "subscriberData(tax).items"
  //- :criteriu=    "subscriberData(tax).criteriu"
  //- :fetching=    "subscriberData(tax).fetching"

  //- :references=  "$FFlodger.forms[tax].referenceTaxonomies"
  //- :showElements="$lodger.forms[tax].__displayItemKeys"
  //- :referencesIds="$lodger.activeReferencesIds($lodger.referenceTaxonomies(tax))"
  //- :items=       "$lodger[$lodger.plurals.get(tax)](playgroundSubscriber)"

  //- servicii.box

  //- registru
    //- blocuri(
    //-   layout= "interactiv"
    //- )

  .stats(slot="sidebar")
    h5 stats

    .boxes
      .box.totals
        h6 Totals

  .prefs(slot="sidebar")
    h6 prefs
    .boxes

</template>

<script>
import sction from 'c/section'
import frm from 'c/form'
import list from 'c/renderlessTax'
import registru from 'c/registru'
import servicii from 'c/servicii'
import modal from 'c/modal'
import viw from 'c/viewElement'
// import blocuri from 'c/blocuri'

import field from 'form/field'
import buton from 'form/button'
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      subscriberName: 'pg2',
    }
  },

  computed: {
    taxAsPlural () {
      return p => p.indexOf('Id') === p.length - 2 ? p.replace('Id').plural : p
    },
    refsIds () {
      return tax => {
        const x = {}
        const { name, parents } = tax
        const { subscriberName } = this
        if (parents && parents.length) {
          parents.map(tax => {
            const $tax = this.$lodger[tax] || this.$lodger[tax.plural]
            if (!$tax) return
            const { form: { plural }, subscribers } = $tax
            const sub = subscribers[subscriberName]

            if (sub) {
              const { selectedId } = sub
              if (selectedId)
                x[plural === tax ? plural : `${tax}Id`] = plural === tax ? [ selectedId ] : selectedId
            }
          })
        }
        return x
      }
    }
    // items() {
    //   return (taxonomy, subscriberName) => subscriberName && taxonomy[subscriberName] ?
    //     taxonomy[subscriberName].items :
    //     {}

    // }
  },
  components: {
    sction,
    field,
    // frm,
    list,
    // registru,
    // servicii,
    // blocuri,
    buton,
    viw
  },
}
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette
typeColors = config.typography.palette

.item
  &__controls
    margin-left auto
    display flex
    flex-flow row nowrap
    position absolute
    right -120px
    transition right .1s ease

    *
      line-height 14px

    > button:first-child
      margin-left 64px

    button
      background transparent

#pg
  .inner
    display grid
    grid-template-columns 12px 12px 12px
    grid-template-rows 12px 12px 12px
    // flex-flow row nowrap

  *
    user-select none

  aside
    background rgba(black, .05)
    padding 24px

  &.boxes
    [data-tax]
      display flex
      flex-flow column nowrap
      margin 8px
      padding 8px
      border 1px solid rgba(black, .05)
      flex 0 1 280px

    .sort
      background-color: rgba(black, .05)


    li
      display flex
      flex-flow row nowrap
      justify-content space-between
      position relative
      overflow hidden
      padding 8px
      width 100%

      strong
        font-weight 400
        font-size 14px
        display inline
        color: typeColors.headings

        &:first-of-type
          &:hover
            text-decoration underline

      &.last
        > strong:first-of-type
          &:after
            content ''
            display inline-block
            vertical-align middle
            bubble()

      &:not(:last-child)
        border-bottom: 1px solid colors.borders

      &.selected
        > strong:first-of-type
          color: colors.primary !important

      &:hover
      &:active
        .item
          &__controls
            right 0


    ul
      margin -8px
      width calc(100% + 16px)
      position relative
      background: colors.bgs.ui
      padding 0
      max-height 300px
      overflow auto
      position relative

      &:before
        content ''
        position absolute 0
        z-index -1
        background-color white
        background-image embedurl('~static/loaders/preload.svg')
        background-position 50% 50%
        background-repeat no-repeat
        transform translateY(-100%)
        transition transform .15s ease-out

      &.fetching
        &:before
          z-index 5
          transform translateY(0)

    .sort
      margin 8px -8px
      flex 1 1 100%

  h3
    margin-bottom 0
    white-space nowrap
    flex 1 1 auto
    text-align left

    small
      margin-left 8px
      opacity .6

  header
    display flex
    flex-flow row wrap

    &+p
      padding 12px
      font-style italic

    .new
      size 24px
      line-height 24px
      border-radius 50px

  > button
    margin auto auto 0

  &es
    display flex
    flex-flow row wrap
    margin -8px

  &.prefs
    margin-left auto
    min-width 200px
</style>
