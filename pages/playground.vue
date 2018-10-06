<template lang="pug">
sction#pg
  .boxes
    list.box(
      v-for=        "tax in $lodger.taxonomii"
      :key=         "tax"
      :taxonomy=    "tax"
      :plural=      "$lodger.plurals.get(tax)"

      :deselectOnClickAway = false

      @created=     "$lodger.subscribe(playgroundSubscriber, tax, $event)"

      @new=         "$event.shiftKey && process.env.NODE_ENV === 'dev' ? $lodger.put(tax, fakeData(tax), references) : openModal(`${tax}.new`)"
      @edit=        "openModal({ id: `${tax}.edit`, data: $event })"
      @trash=       "$lodger.trash(tax, $event)"

      @select=      "$lodger.select(tax, $event)"
      :selected=    "$lodger.getters[`${tax}/selected`]"

      @reSort=      "$lodger.subscribe(playgroundSubscriber, tax, $event)"
      :sortOptions= "$lodger.form(tax).sortOptions"

      :items=       "$lodger.docsHolder && $lodger.docsHolder[playgroundSubscriber] ? $lodger.docsHolder[playgroundSubscriber][$lodger.plurals.get(tax)] : null"
      :showElements="$lodger.form(tax).__displayItemKeys"
    )
    //- :items=       "$lodger[$lodger.plurals.get(tax)](playgroundSubscriber)"

    servicii.box

  registru

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

// this should only stay here, on playground
import fakeData from 'lodger/lib/helpers/dev/fakeData'

@Component({
  components: {
    sction,
    frm,
    list,
    registru,
    servicii
  }
})
  export default class Playground extends Vue {
    @Action('open', { namespace: 'modal' }) openModal: any

    get playgroundSubscriber () {
      return 'playground'
    }
  }
</script>

<style lang="stylus">
#pg
  .inner
    display flex
    flex-flow row nowrap

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
