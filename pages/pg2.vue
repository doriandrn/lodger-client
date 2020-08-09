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
    )
      header(slot-scope="{ taxonomy, subscriber }")
        h3 {{ taxonomy.plural }}
        button.new(
          @click="taxonomy.put(Object.assign({}, taxonomy.form.fakeData, refsIds(taxonomy)))"
        ) +

      div(
        slot="item" slot-scope="{ item, subscriber }"
        @click="subscriber.select(item[subscriber.primaryPath])"
      )
        //- :href="`${ $lodger[tax].name }/${ item[subscriber.primaryPath] }`"
        a( @click="subscriber.edit(item[subscriber.primaryPath])") {{ item.name || item[subscriber.primaryPath] }}
        //- a(href='' @click="openModal({ id: item[subscriber.primaryPath], tax: $lodger[tax].form.plural })") {{ item.name }}
    //- @new=         "openModal(`${tax}.new`)"
    //- @edit=        "openModal({ id: `${tax}.edit`, data: $event })"
    //- :items=       "subscriberData(tax).items"
    //- :criteriu=    "subscriberData(tax).criteriu"
    //- :fetching=    "subscriberData(tax).fetching"

    //- :references=  "$lodger.forms[tax].referenceTaxonomies"
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
  watch: {
    '$route.path': function () {
      console.log(arguments)
    }
  },
  mounted () {
    console.log(this.$lodger)
    console.log(this.$lodger.taxonomies)
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
    // frm,
    list,
    // registru,
    // servicii,
    // blocuri,
    buton
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

    header
      display flex
      flex-flow row nowrap

      .new
        margin-left auto

    &.list
      flex 0 1 280px

      > ul
        margin -8px
        width calc(100% + 16px)

      .sort
        margin 8px -8px

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
