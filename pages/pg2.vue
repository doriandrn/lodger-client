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
      :subscriberName="subscriberName"
    )
      div(slot-scope="{ taxonomy, subscriber }")
        h3 {{ taxonomy.plural }}
        button.new(@click="taxonomy.put(taxonomy.form.fakeData)") add

      div(
        slot="item" slot-scope="{ item, subscriber }"
        @click="subscriber.select(item[subscriber.primaryPath])"
      )
        //- a(:href="`${$lodger[tax].form.name}/${item[subscriber.primaryPath]}`") {{ item.name }}
        a(href="#" @click="subscriber.edit(item[subscriber.primaryPath])") {{ item.name }}
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
// import blocuri from 'c/blocuri'

import buton from 'form/button'
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      subscriberName: 'pg2'
    }
  },
  mounted () {
    console.log(this.$lodger)
    console.log(this.$lodger.taxonomies)
  },
  // computed: {
  //   items() {
  //     return (taxonomy, subscriberName) => subscriberName && taxonomy[subscriberName] ?
  //       taxonomy[subscriberName].items :
  //       {}

  //   }
  // },
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
