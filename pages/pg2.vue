<template lang="pug">
sction#pg
  .actions
    h5 main actions
    buton(
      size=     "large"
      rounded=  true
      icon=     "incaseaza"
    ) incaseaza
  .boxes
    list.box(
      v-for=        "tax in $lodger.taxonomies"
      :key=         "tax"
      :taxonomy=    "$lodger[tax]"
      :subscriberName=  "subscriberName"
      :data-tax=  "tax"
    )
      header(slot-scope="{ taxonomy, subscriber }")
        h3 {{ taxonomy.plural }}
        button.new(
          @click="taxonomy.put(Object.assign({}, taxonomy.form.fakeData, refsIds(taxonomy)))"
        ) +

        field.sort(
          v-if=     "subscriber && subscriber.ids.length > 1"
          type=     "radios"
          label=    "sort.label"
          v-model=  "subscriber.criteria"
          :id=       "`sort-${ subscriber.name }`"
          :options=  "taxonomy.form.schema.indexes"
          required= true
          :class=     "{ reverseActive: subscriber.criteria && subscriber.criteria.sort && subscriber.criteria.sort.direction < 1 }"
          @click=    "subscriber.criteria.sort = $event.checked ? { key: $event.index, direction: -1 } : subscriber.criteria.sort"
        )

      li(
        slot= "item"
        slot-scope="{ item, subscriber, taxonomy }"
        :class= "{ last: taxonomy && item._id === taxonomy.lastItems[0], selected: taxonomy && String(taxonomy.subscribers[subscriberName].selectedId).indexOf(item._id) > -1 }"
        @click="subscriber.select(item[subscriber.primaryPath])"
      )
        viw(
          v-for=  "key, i in taxonomy.form.previewFields"
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

  h1 test shit
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
      subscriberName: 'pg2'
    }
  },

  computed: {
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
#pg
  .inner
    display grid
    grid-template-columns 12px 12px 12px
    grid-template-rows 12px 12px 12px
    // flex-flow row nowrap

  *
    user-select none

  li
    cursor pointer

  .box
    display flex
    flex-flow column nowrap
    margin 8px
    padding 8px
    border 1px solid rgba(black, .05)

    h3
      margin-bottom 0

    header
      display flex
      flex-flow row wrap

      .new
        size 24px
        line-height 24px
        border-radius 50px

    &.list
      flex 0 1 280px

      > ul
        margin -8px
        width calc(100% + 16px)

      .sort
        margin 8px -8px
        flex 1 1 100%

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
