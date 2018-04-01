<template lang="pug">
.results(data-box-arrow)
  .results__section(v-for="tax in Object.keys(results)")
    h6.results__heading {{ tax }}
    //- nuxt-link(
    //-   v-for=    "res, i in results[tax]",
    //-   :key=     "res.id"
    //-   :class=   "{ selected: i === selectedIndex, irelevant: res.relevance < 0.25 }"
    //-   :to=      "`/${tax}/${res.id}`"
    //- )
    adresa(
      v-for=    "res, i in results.apartamente",
      :key=     "i"
      v-if=     "tax === 'apartamente'"
      :apId=    "res.id"
      :class=   "{ selected: i === selectedIndex, irelevant: res.relevance < 0.25 }"
    )

</template>

<script>
import adresa from '~components/adresa'

export default {
  props: {
    selectedIndex: {
      type: Number,
      default: 0
    },
    results: {
      type: Object,
      default () { return {} }
    }
  },
  components: {
    adresa
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
spacings = 16px

.results
  position absolute
  top calc(100% + 25px)
  right 0
  background white
  line-height 20px
  max-height 50vh
  min-width 320px
  box-shadow: config.shadows.boxes
  border-top-radius: (config.radiuses.boxes/2)
  border-bottom-radius: config.radiuses.boxes
  display flex
  flex-flow column nowrap
  opacity 0
  visibility hidden
  transition all .15s ease-in-out

  &__section
    display flex
    flex-flow row wrap
    overflow-y auto
    padding 8px 0

    > a
      flex 1 0 100%
      padding: (spacings/2) (spacings*1.5)
      text-transform capitalize
      text-decoration none

      for i in 1 2 3 4 5
        &:nth-child({i}):not(.irelevant)
          color: lighten(config.typography.palette.headings, i*10%)

      &.irelevant
        color: config.typography.palette.meta

      &.selected
      :active
      :focus
        background-color: config.palette.selectedItem

        .proprietar
          color: config.typography.palette.headings

      &:hover
        color: config.typography.palette.headings
        background-color: config.palette.selectedItem

      &:not(.selected)
        .adresa__main
          display none


  &__heading
    padding: 0 spacings
    flex 1 0 100%
    margin 4px 0 12px
    // text-transform capitalize

</style>
