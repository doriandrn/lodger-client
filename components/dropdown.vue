<template lang="pug">
.dropdown(
  :class=   "{'dropdown--open': open}",
  v-on-clickaway=   "inchide"
  data-box-arrow
)
  buton.dropdown__toggle(
    :icon=    "icon",
    :icon-only= "iconOnly"
    @click=   "open = !open",
    :arrow=   "arrow"
    styl=     "unstyled"
    :tabIndex= "0"
  ) #[slot(name="beforeText")] {{ toggleText }}
    slot(name="buton")
  .dropdown__content
    .dropdown__header(v-if="$slots.header")
      slot(name="header")
    .dropdown__main(v-if="$slots.default")
      slot
    .dropdown__footer(v-if="$slots.footer")
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
  watch: {
    '$route': function () {
      this.open = false
    }
  }
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
  &__footer
    border-top: 1px solid colors.borders
    background: colors.bgs.body
  &__header
    border-bottom: 1px solid colors.borders
    padding 6px 12px
    p
      color rgba(black, .55)
      margin 0

  &__toggle
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
  &__main
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

  &__content
    opacity 0
    visibility hidden
    max-height 0
    min-width 190px
    position absolute 105% 0 auto auto
    background white
    box-shadow: shadow
    border-radius 2px 3px 5px 8px
    overflow hidden
    transition all .15s ease-in-out

  &[data-box-arrow]
    &:before
    &:after
      opacity 0
    
  &--open
    &[data-box-arrow]
      &:before
      &:after
        bottom 0
        opacity 1

    .dropdown
      &__content
        opacity 1
        visibility visible
        max-height 50vh
        top 100%

      &__main
        > button
        > a
          &:hover
            background-color: colors.selectedItem
    .dropdown
      &__toggle
        background: colors.bgs.body
        &:after
          transform rotate(180deg)
</style>