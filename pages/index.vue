<template lang="pug">
sction#pg3(boxes)
  nav.view
    li tree
    li boxes

  list.list(
    v-for=        "tax in $lodger.taxonomies.filter(t => t !== 'utilizatori')"
    v-if=         "!$lodger[tax].parents || $lodger[tax].parents && $lodger[tax].form.schema.required.filter(p => $lodger[tax].parents.indexOf(taxAsPlural(p)) > -1)"
    :key=         "tax"
    :taxonomy=    "$lodger[tax]"
    :subscriberName=  "subscriberName"
    :data-tax=  "tax"
  )
    header(slot-scope=  "{ taxonomy, subscriber }")
      h3 {{ $lodger.i18n.taxonomies[taxonomy.plural] ? $lodger.i18n.taxonomies[taxonomy.plural].plural : taxonomy.plural }}
        small(v-if="taxonomy.totals") {{ subscriber.ids.length }} / {{ taxonomy.totals }}

      button.new(
        :disabled=    "$lodger[tax].parents && $lodger[tax].parents.length && (!subscriber.refsIds || subscriber.refsIds && Object.values(subscriber.refsIds).filter(v=>v).length < $lodger[tax].parents.length)"
        @click.shift= "taxonomy.put(Object.assign({}, taxonomy.form.fakeData, { ...subscriber.refsIds }))"
        @click=       "$lodger.modal.activeDoc = taxonomy.collection.newDocument({ ...subscriber.refsIds })"
      ) +

      field.sort(
        v-if=     "subscriber && subscriber.ids.length > 1"
        type=     "radios"
        label=    "sort.label"
        :value=  "subscriber.criteria.sort"
        :id=       "`sort-${ subscriber.name }-${tax}`"
        :options=  "Object.assign({}, ...taxonomy.form.schema.indexes.map(n => ({ [n] : 0 })) )"
        required= true
        :class=     "{ reverseActive: subscriber.criteria && subscriber.criteria.sort && subscriber.criteria.sort < 1 }"
        @click=    "subscriber.criteria.sort = $event.checked ? { [$event.index]: -1 } : { [$event.index]: 1 }; debug($event)"
      )

      //- p(v-if="subscriber.refsIds") {{ subscriber.refsIds }}
      //- p(v-if="subscriber.criteria") {{ subscriber.criteria.filter || 'no filters' }}

    li(
      slot= "item"
      slot-scope="{ item, subscriber, taxonomy }"

      :class= "{ last: taxonomy && item[subscriber.primaryPath] === taxonomy.lastItems[0], selected: taxonomy && String(taxonomy.subscribers[subscriberName].selectedId).indexOf(item[subscriber.primaryPath]) > -1 }"
      @click= "subscriber.select(item[subscriber.primaryPath])"
    )
      viw(
        v-for=  "key, i in taxonomy.form.previewFields.filter(f => f.indexOf('Id') !== f.length - 2)"
        :type=  "key",
        :key=   "key",
        :value= "['suma', 'balanta'].indexOf(key) > -1 ? { suma: item[key], moneda: item.moneda } : item[key]"
        :avatarSeed= "item['name']"
        @click= "subscriber.edit(item[subscriber.primaryPath])"
      )

  .stats(slot="sidebar")
    h3 stats

    h4 Ultimele 30 de zile

  .widget(slot="sidebar")
    h3 latest actions


</template>

<script>
import sction from 'c/section'
import frm from 'c/form'
import list from 'c/renderlessTax'
import registru from 'c/registru'
import servicii from 'c/servicii'
import modal from 'c/modal'
import viw from 'c/viewElement'

import field from 'form/field'
import buton from 'form/button'

export default {
  computed: {
    subscriberName () {
      return this.$lodger.mainSubName
    },
    taxAsPlural () {
      return p => p.indexOf('Id') === p.length - 2 ? p.replace('Id').plural : p
    }
  },
  components: {
    sction,
    field,
    list,
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

#pg3
  .inner
    display grid
    grid-template-columns 12px 12px 12px
    grid-template-rows 12px 12px 12px
    // flex-flow row nowrap

  *
    user-select none

  aside
    margin-top 30px

    +above(xl)
      margin-top 0
      margin-left 48px

  .view
    flex 1 1 100%
    display flex
    flex-flow row nowrap

    > li
      width auto !important
      flex 0 0 auto

      &:first-child
        margin-left auto

  &.boxes
    .inner > div > *
      margin 8px

    [data-tax]
      display flex
      flex-flow column nowrap
      padding 8px
      // border 1px solid rgba(black, .05)
      order 10
      flex 1 1 100%

      +above(l)
        flex 0 1 266px

    [data-tax="utilizatori"]
      order 0

    [data-tax="asociatii"]
      order 1

    [data-tax="blocuri"]
      order 2

    [data-tax="apartamente"]
      order 3

    .sort
      background-color: rgba(black, .05)




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
    min-height 40px

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
