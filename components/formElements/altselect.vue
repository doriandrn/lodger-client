<template lang="pug">
.altselect(
  :data-arrow=  "arrow"
  :id=          "id",
  tabIndex=     "-1"
  :class=   "{ disabled }"
)
  ul
    li(
      v-for=        "option, key in options",
      :tabIndex=    "value === key ? 0 : -1"
      :data-sel=    "value === key"
      :data-value=  "key",
      @click=       "alege(key)"
      :data-icon=   "option.icon || id === 'asociatieSwitch' && asocInitProgr(option) < 100 ? 'alert-circle' : null || null"
    )
      span {{ option }}
    slot(name="items")
  slot
</template>

<script>
import progres from 'c/progres'
import { createPopper } from '@popperjs/core'

export default {
  // mounted () {
  //   const pop = this.$el.querySelector('ul')
  //   createPopper(this.$el, pop, { placement: 'top' })
  // },
  methods: {
    alege (value) {
      this.debug('ales', value)
      this.$emit('input', value)
      this.$el.blur()
    },
    asocInitProgr (aId) {
      const { asociatii, debug, value } = this
      if (aId === value) return
      const asociatie = asociatii[aId]
      if (!asociatie) return false
      if (!asociatie.servicii || !asociatie.servicii.length) return 0
      return 20
    }
  },
  components: {
    progres
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
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

  font-size 14px
  line-height 16px

  max-width 100%
  height 100%
  width 100%
  max-height 36px
  overflow hidden
  cursor default

  &.disabled
    > ul
      > li
        padding-left 4px
        padding-right 0

  &:not(.disabled)
    cursor pointer
    background-image embedurl('~static/icons/ui/dropdown.svg', 'utf8')
    background-repeat no-repeat
    background-position calc(100% - 16px) 50%

    > ul
      background-color: #f5f7fb;
      box-shadow:  6px 6px 12px #d0d2d5, -6px -6px 12px #ffffff;

      > li
        &:not([data-sel])
          &:hover
          &:focus
            background-color: config.palette.selectedItem !important
            color: config.typography.palette.headings

    &:active
    &:focus
    &:hover
      outline none
      overflow visible
      box-shadow 0px 1px 2px rgba(#8B7070, .1)

      > ul
        background white
        height auto
        border-color: config.typography.palette.light !important
        cursor pointer
        color: config.typography.palette.ui

      &:after
        background-color: config.typography.palette.headings !important

  > ul
    list-style-type none
    padding 0
    width 100%

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

        .progres
        &:before
          display none

  &:after
    position absolute
    background: config.typography.palette.meta
    right 20px
    top 12px
    transition all .1s ease


</style>
