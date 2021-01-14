<template lang="pug">
.results(data-box-arrow)
  .load(v-if= "fetching")

  section(v-else-if=  "Object.keys(results).filter(tax => results[tax].length > 0).length < 1")
    p {{ $l.i18n.search.noResults }}

  section(
    v-for=  "tax in Object.keys(results)"
    v-if=   "results[tax].length > 0"
  )
    h4 {{ $l.i18n.taxonomies[tax.plural] ? $l.i18n.taxonomies[tax.plural].plural : tax.plural }}
    ul
      li(
        v-for=    "res, i in results[tax]"
        v-if=     "res.score > sugestiiSubRelevanta"
        :data-sel=   "i === selectedIndex"
        @click=   "$emit('selecteaza', { id: res.obj._id, tax })"
      )
        viw(
          v-for=  "o in Object.keys(res.obj).filter(key => key.indexOf('_') !== 0)"
          :type=  "o"
          :key=   "o"
          :value= "res.obj[o]"
        )
</template>

<script>
import viw from 'c/viewElement'

export default {
  data () {
    return {
      // sugestiiSubRelevanta: .05
      sugestiiSubRelevanta: -1
    }
  },
  props: {
    selectedIndex: {
      type: Number,
      default: 0
    },
    results: {
      type: Object,
      default () { return {} }
    },
    fetching: {
      type: Boolean,
      default: true
    }
  },
  components: {
    viw
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
spacings = 16px

.results
  position absolute
  top calc(100% + 25px)
  left 0
  width calc(100% + 40px)
  background white
  line-height 20px
  max-height 50vh
  box-shadow: config.shadows.boxes
  border-top-radius: (config.radiuses.boxes/2)
  border-bottom-radius: config.radiuses.boxes
  border: 1px solid config.palette.borders
  display flex
  flex-flow column nowrap
  opacity 0
  visibility hidden
  transition all .15s ease-in-out

  &.v
    top 42px
    opacity 1
    visibility visible
    z-index 51
    max-width 300px

    &.singleTax
      h5
        display none

  section
    display flex
    flex-flow row wrap
    overflow-y auto
    padding 0

    > *
      padding 8px 16px

    .bani
      position absolute
      right 12px
      top 8px

    strong
      text-align left
      color #222

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
        flex-flow row wrap
        position relative
        cursor pointer

        > *
          flex 1 1 auto
          padding: (spacings/2) (spacings*1.5)
          text-transform capitalize
          text-decoration none
          font-weight 400

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

  h4
    flex 1 0 100%
    margin 4px 0 4px
    text-align left
    // text-transform capitalize

</style>
