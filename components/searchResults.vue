<template lang="pug">
.results(data-box-arrow)
  .results__section(
    v-for=  "tax in Object.keys(results)"
    v-if=   "results[tax].length > 0"
  )
    h6.results__heading {{ tax }}
    ul
      li(
        v-for=    "res, i in results[tax]"
        v-if=     "res.relevance > sugestiiSubRelevanta"
        :data-sel=   "i === selectedIndex"
        @click=   "$emit('selecteaza', { id: res.id, tax })"
      )
        split(
          v-if=     "tax === 'apartamente'"
          v-tooltip=  "'nume n shit'"
        )
          apartament(
            :key=     "i"
            :apId=    "res.id"
            clickabil=false
          )
          bani.restanta(
            slot=       "right"
            v-if=       "modalContent === 'incasare.new' && tax === 'apartamente'"
            :valoare=   "aps[res.id].balanta"
          )
        furnizor(
          v-if= "tax === 'furnizori'"
          :key= "res.id"
          :id=  "res.id"
        )

</template>

<script>
import bani from '~components/bani'
import apartament from 'struct/apartament'
import furnizor from '~components/furnizor'
import split from '~components/split'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      // sugestiiSubRelevanta: .05
      sugestiiSubRelevanta: -1
    }
  },
  computed: mapGetters({
    modalContent: 'modal/content',
    aps: 'apartamente'
  }),
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
    apartament,
    bani,
    furnizor,
    split
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
  border: 1px solid config.palette.borders
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

    .bani
      position absolute
      right 12px
      top 8px

    > ul
      list-style-type none
      padding 0
      margin 0
      display flex
      flex-flow row wrap
      width 100%

      > li
        flex 1 1 100%
        display flex
        flex-flow row nowrap
        position relative
        cursor pointer

        > *
          flex 1 0 100%
          padding: (spacings/2) (spacings*1.5)
          text-transform capitalize
          text-decoration none
          &:active
          &:focus
            background-color: config.palette.selectedItem

            .proprietar
              color: config.typography.palette.headings

          &:hover
            color: config.typography.palette.headings
            background-color: config.palette.selectedItem

        &.irelevant
          > a
          > span
            color: config.typography.palette.meta

        &.selected
          > a
          > span
            color: config.typography.palette.headings
            background-color: config.palette.selectedItem

          for i in 1 2 3 4 5
            &:nth-child({i}):not(.irelevant)
              > a
              > span
                color: lighten(config.typography.palette.headings, i*10%)

        &:not(.selected)
          .adresa__main
            display none

    .adresa__owner
      flex 0 0 20px
  &__heading
    padding: 0 spacings
    flex 1 0 100%
    margin 4px 0 12px
    // text-transform capitalize

</style>
