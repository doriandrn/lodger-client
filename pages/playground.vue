<template lang="pug">
sction#pg
  .boxes
    list.box(
      v-for=      "tax in $lodger.taxonomii"
      :key=       "tax"
      :taxonomy=  "tax"
    )

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

import sction from 'c/section'
import frm from 'c/form'
import list from 'c/list'
import registru from 'c/registru'
import servicii from 'c/servicii'

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
  }
</script>

<style lang="stylus">
#webpack-hot-middleware-clientOverlay
  display none

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
