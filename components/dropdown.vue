<template lang="pug">
.dropdown(
  :class=   "{ open }",
  v-on-clickaway=   "inchide"
  data-box-arrow
)
  buton(
    :icon=    "icon",
    :icon-only= "iconOnly"
    @click=   "open = !open"
    :arrow=   "arrow"
    styl=     "unstyled"
    :tabIndex= "0"
  ) #[slot(name="beforeText")] {{ toggleText }}
    slot(name="buton")

  div
    header(v-if="$slots.header || iconOnly")
      h6(v-if=  "iconOnly") {{ toggleText }}
      slot(name="header")

    main(v-if="$slots.default")
      slot

    footer(v-if="$slots.footer")
      slot(name="footer")
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import buton from 'form/button'

export default {
  data () {
    return {
      open: false
    }
  },
  components: {
    buton
  },
  mixins: [clickaway],
  props: {
    toggleText: {
      type: String,
      default: 'Drop'
    },
    icon: {
      type: String,
      default: null
    },
    arrow: {
      type: Boolean,
      default: true
    },
    iconOnly: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    inchide () {
      this.open = false
    }
  },
}
</script>

<style lang="stylus">
@require '~styles/config'

colors = config.palette
shadow = -1px 2px rgba(black, .05)

.dropdown
  position relative
  z-index 101
  height 100%
  user-select none

  footer
    border-top: 1px solid colors.borders
    background: colors.bgs.body

  header
    border-top 3px solid white
    border-bottom: 1px solid colors.borders
    background rgba(black, .05)
    padding 6px 12px
    p
      color rgba(black, .55)
      margin 0

  h6
    margin-bottom 0

  > button
    background transparent
    color #666
    display flex
    align-items center
    font-weight 400
    font-size 13px
    height 100%
    position relative
    padding 0 12px

    &:hover
      background: colors.bgs.body

    &[data-arrow]
      &:after
        position relative
        mask-image embedurl('~static/icons/ui/chevron-down.svg')
        transition transform .15s ease-in-out

  main
    border 2px solid white
    display flex
    flex-flow row wrap
    padding 8px 0

    > button
    > a
      &[data-styl="unstyled"]
        padding 4px 16px
        flex 1 1 100%
        justify-content flex-start
        border-radius 0

  > div
    opacity 0
    visibility hidden
    max-height 0
    min-width 190px
    position absolute 105% 0 auto auto
    background white
    box-shadow: shadow
    border-radius 2px 3px 5px 8px
    transition all .15s ease-in-out

  &[data-box-arrow]
    &:before
    &:after
      opacity 0

  &.open
    &[data-box-arrow]
      &:before
      &:after
        bottom 0
        opacity 1

    > div
      opacity 1
      visibility visible
      max-height 50vh
      top 100%

    main
      > button
      > a
        &:hover
          background-color: colors.selectedItem

    > button
      background: colors.bgs.body

      &:after
        transform rotate(180deg)
</style>
