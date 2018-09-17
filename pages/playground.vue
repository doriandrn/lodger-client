<template lang="pug">
sction#pg
  .boxes
    list.box(
      v-for=      "tax in $lodger.taxonomii"
      :key=       "tax"
      :taxonomy=  "tax"
    )

    
    //- .details(taxonomy="asociatie")
    
    //-   div blocuri
    //-     list.box(taxonomy="incasare")

    //- .box.asociatie(v-if="idAsociatieSelectata")
    //-   
    //-   .asociatie__details
    //-     p #[em balanta] {{ asociatieSelectata.balanta }}

  .box.prefs
    h6 preferences list
</template>

<script lang="ts">
import Vue from 'vue'
import sction from 'c/section'
import frm from 'c/form'
import list from 'c/list'
import Component from 'vue-class-component'

@Component({
  components: {
    sction,
    frm,
    list
  },
  layout: 'tspg'
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

  *
    user-select none

  li
    cursor pointer

  .box
    display flex
    flex-flow row wrap
    flex 0 1 285px
    margin 8px
    padding 8px
    border 1px solid rgba(black, .05)

    &es
      display flex
      flex-flow row wrap

    > *
      flex 1 1 100%

    &.prefs
      margin-left auto
      min-width 200px
</style>
