<template lang="pug">
sction#pg
  .boxes
    list.box(
      v-for=      "tax in $lodger.taxonomii"
      :key=       "tax"
      :taxonomy=  "tax"
    )
  
  registru
    
      //- .details(taxonomy="asociatie")
      
      //-   div blocuri
      //-     list.box(taxonomy="incasare")

      //- .box.asociatie(v-if="idAsociatieSelectata")
      //-   
      //-   .asociatie__details
      //-     p #[em balanta] {{ asociatieSelectata.balanta }}

  .box.prefs(slot="sidebar")
    h6 preferences list
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import sction from 'c/section'
import frm from 'c/form'
import list from 'c/list'
import registru from 'c/registru'

@Component({
  components: {
    sction,
    frm,
    list,
    registru
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
  ul
    padding 0
    max-height 300px
    overflow auto

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
