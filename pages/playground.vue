<template lang="pug">
sction#pg
  .actions
    h5 main actions
    buton(
      size=     "large"
      rounded=  true
      icon=     "incaseaza"
      @click=   "openModal('incasare.new')"
    ) incaseaza
  .boxes
    list.box(
      v-for=        "tax in $lodger.taxonomii"
      :key=         "tax"
      :taxonomy=    "tax"
      :plural=      "$lodger.forms[tax].plural"

      :deselectOnClickAway = false

      @subscribe=   "$lodger.subscribe(playgroundSubscriber, tax, $event)"

      @fakeNew=     "$lodger.put(tax, fakeData(tax))"
      @new=         "openModal(`${tax}.new`)"
      @edit=        "openModal({ id: `${tax}.edit`, data: $event })"
      @trash=       "$lodger.trash(tax, $event)"

      @select=      "$lodger.select(tax, {id: $event, subscriber: playgroundSubscriber })"
      :selected=    "typeof $lodger.getters[`${tax}/selected`] !== 'object' ? $lodger.getters[`${tax}/selected`] : $lodger.getters[`${tax}/selected`].id"
      :last=        "$lodger.getters[`${tax}/last`]"

      :sortOptions= "$lodger.forms[tax].sortOptions"

      :items=       "subscriberData(tax).items"
      :criteriu=    "subscriberData(tax).criteriu"
      :fetching=    "subscriberData(tax).fetching"

      :references=  "$lodger.forms[tax].referenceTaxonomies"
      :showElements="$lodger.forms[tax].__displayItemKeys"
    )
    //- :referencesIds="$lodger.activeReferencesIds($lodger.referenceTaxonomies(tax))"
    //- :items=       "$lodger[$lodger.plurals.get(tax)](playgroundSubscriber)"

    servicii.box

  registru

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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Action } from 'vuex-class'

import sction from 'c/section'
import frm from 'c/form'
import list from 'c/list'
import registru from 'c/registru'
import servicii from 'c/servicii'
// import blocuri from 'c/blocuri'

import buton from 'form/button'

// this should only stay here, on playground
import fakeData from 'lodger/lib/helpers/dev/fakeData'

@Component({
  components: {
    sction,
    frm,
    list,
    registru,
    servicii,
    // blocuri,
    buton
  },
  methods: {
    fakeData
  }
})
  export default class Playground extends Vue {
    @Action('open', { namespace: 'modal' }) openModal: any

    get playgroundSubscriber () {
      return 'playground'
    }

    get subscriberData () {
      const {
        playgroundSubscriber,
        $lodger: {
          subscriberData
        }
      } = this

      return (taxonomy: Taxonomie) => subscriberData(taxonomy, playgroundSubscriber)
    }
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
