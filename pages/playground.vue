<template lang="pug">
sction#pg
  .actions
    buton(
      size=     "large"
      icon=     "incasare"
      @click=   "openModal('incasare.new')"
    ) incaseaza

  .boxes
    //- list.box(
    //-   v-for=        "tax in $lodger.taxonomii"
    //-   :key=         "tax"
    //-   :taxonomy=    "tax"
    //-   :plural=      "$lodger.forms[tax].plural"
    //-   subscriber=   "plural"

    //-   deselectOnClickAway = false

    //-   @subscribe=   "$lodger.subscribe(subscriber, tax, $event)"

    //-   @fakeNew=     "$lodger.put(tax, fakeData(tax), subscriber)"
    //-   @new=         "openModal(`${tax}.new`, {data: { subscriber }} )"
    //-   @edit=        "openModal({ id: `${tax}.edit`, data: $event })"
    //-   @trash=       "$lodger.trash(tax, $event)"

    //-   @select=      "$lodger.select(tax, {id: $event, subscriber: subscriber })"
    //-   :selected=    "typeof $lodger.getters[`${tax}/selected`] !== 'object' ? $lodger.getters[`${tax}/selected`] : $lodger.getters[`${tax}/selected`].id"
    //-   :last=        "$lodger.getters[`${tax}/last`]"

    //-   :sortOptions= "$lodger.forms[tax].sortOptions"

    //-   :items=       "subscriberData(tax).items"
    //-   :criteriu=    "subscriberData(tax).criteriu"
    //-   :fetching=    "subscriberData(tax).fetching"

    //-   :references=  "$lodger.forms[tax].referenceTaxonomies"
    //-   :showElements="$lodger.forms[tax].__displayItemKeys"
    //- )
    list.box(
      v-for=        "tax in $lodger.taxonomii"
      :key=         "tax"
      :taxonomy=    "tax"
      :plural=      "$lodger.forms[tax].plural"
      subscriber=   "playground"

      deselectOnClickAway = false

      @fakeNew=     "$lodger.put(tax, fakeData(tax), 'playground')"
      @new=         "openModal(`${tax}.new`, {data: { subscriber: 'playground' }} )"
    )
      div(slot-scope="data")
        buton(
          @click=     "$emit($event.shiftKey ? 'fakeNew' : 'new')"
          styl=       "unstyled"
          icon=       "plus"
          icon-only
        ) adauga
        //- ul(v-if="data.items && data.items.length")
        //-   li(v-for="item, id in data.items")
        //-     span {{ item.title || 'lola' }}
          //- :disabled = "!allReferencesHaveValues"
    //- @subscribe=   "$lodger.subscribe(subscriber, tax, $event)"
    //- :referencesIds="$lodger.activeReferencesIds($lodger.referenceTaxonomies(tax))"

    //- @fakeNew=     "$lodger.put(tax, fakeData(tax), subscriber)"
    //- @new=         "openModal(`${tax}.new`, {data: { subscriber }} )"
    //-   @edit=        "openModal({ id: `${tax}.edit`, data: $event })"
    //-   @trash=       "$lodger.trash(tax, $event)"

    //-   @select=      "$lodger.select(tax, {id: $event, subscriber: subscriber })"

    servicii.box

  //- registru

  h1 test shit
    //- blocuri(
    //-   layout= "interactiv"
    //- )

  .stats(slot="sidebar")
    h5 {{ $t('dashboard.statistics.title') }}

    list(
      taxonomy=     "incasare"
      plural=       "incasari"
      subscriber=   "listeDePlata"
      slot-scope=   "taxData"
      sortable=     false
      filterable=   true
      displayTypes=      "['statistics', 'list']"
      :userOptions=      "['filter']"
    )
      h1 {{ taxData.plural }}

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
