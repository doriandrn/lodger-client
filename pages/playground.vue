<template lang="pug">
sction#pg
  .boxes
    .box
      frm(:form="$lodger.forms[0]")
    list.box(taxonomy="asociatie")

    //- .box.asociatie(v-if="idAsociatieSelectata")
    //-   h2 Selected asoc: {{ asociatieSelectata.name }}
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
    beforeCreate () {
      // this.$store.registerModule('LodgerStore', this.$lodger.store)
      this.$store = this.$lodger.store
    }    
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
    margin 8px

    &es
      display flex
      flex-flow row wrap

    > *
      flex 1 1 100%

    &.prefs
      margin-left auto
</style>
