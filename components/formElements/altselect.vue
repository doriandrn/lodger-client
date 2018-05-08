<template lang="pug">
.altselect(
  :data-arrow=  "arrow"
  :id=          "id",
  tabIndex= "-1"
)
  ul
    li(
      v-for=        "option, key in options",
      :tabIndex=    "value === key ? 0 : -1"
      :data-sel=    "value === key"
      :data-value=  "typeof options === 'object' ? option : key",
      @click=       "alege(option)"
      :data-icon=   "option.icon || id === 'asociatieSwitch' && asocInitProgr(option) < 100 ? 'alert-circle' : null || null"
    )
      split
        span {{ option }}
        progres(
          slot= "right"
          v-if= "id === 'asociatieSwitch'"
          :procent= "asocInitProgr(option)"
        )
    slot
</template>

<script>
import { mapGetters } from 'vuex'
import split from '~components/split'
import progres from '~components/progres'

export default {
  methods: {
    alege (value) {
      this.$emit('input', value)
      this.debug(this)
      this.$el.blur()
    },
    asocInitProgr (aId) {
      const { asociatii, debug } = this
      const asociatie = asociatii[aId]
      if (!asociatie) return false
      if (!asociatie.servicii || !asociatie.servicii.length) return 0
      return 20
    }
  },
  computed: mapGetters({
    asociatii: 'asociatii'
  }),
  components: {
    progres,
    split
  },
  props: {
    id: {
      type: String,
      default: 'altselect'
    },
    value: {
      type: [Number, String],
      default: null
    },
    arrow: {
      type: Boolean,
      default: true
    },
    options: {
      type: [Array, Object],
      default () {
        return {
          demo: 'Demo option'
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.altselect
  position relative
  z-index 11
  cursor pointer
  background-color: config.palette.bgs.body
  max-width 100%
  height 100%
  width 100%
  overflow hidden
  max-height 36px

  > ul
    list-style-type none
    font-size 14px
    line-height 16px
    border: 1px solid config.palette.borders
    border-left-width 2px
    // position absolute 0
    padding 0
    width 100%
    cursor pointer
    height 36px
    // box-shadow 0px 1px 2px rgba(#8B7070, .1)
    color: config.typography.palette.ui
    transition all .15s ease
    display flex
    flex-flow column nowrap

    transition max-height .15s ease-in-out

    > li
      display block
      border 0
      order 2
      flex 1 1 100%
      padding 10px 24px
      outline 0
      transition color .1s ease-in-out

      &[data-sel]
        color: config.typography.palette.headings
        order 1
      
      &:not([data-sel])
        &:hover
        &:focus
          background-color: config.palette.selectedItem !important
          color: config.typography.palette.headings

  &:after
    position absolute
    background: config.typography.palette.meta
    right 20px
    top 12px
    transition all .1s ease
  
  &:active
  &:focus
  &:hover
    outline none
    overflow visible

    > ul
      background white
      height auto
      border-left-color: config.typography.palette.light !important

    &:after
      background-color: config.typography.palette.headings !important
      
</style>
