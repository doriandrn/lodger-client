<template lang="pug">
.dropdown(
  :class=   "{'dropdown--open': open}",
  v-on-clickaway=   "inchide"
)
  buton.dropdown__toggle(
    :icon=    "icon",
    @click=   "open = !open",
    :arrow=   "arrow"
    styl=     "unstyled"
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

.dropdown
  position relative
  z-index 101
  line-height .75vr
  user-select none
  &__footer
    border-top: 1px solid colors.borders
    background: colors.bgs.body
  &__header
    border-bottom: 1px solid colors.borders
    padding .5vr 12px
    p
      color rgba(black, .55)
      margin 0
  &__header
  &__content
    line-height 1vr
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
    &.arrow
      padding-right 20px
      padding-left 12px
      &:after
        content '>'
        position absolute
        font-size 8px
        line-height 0
        right 10px
        top 50%
        transform rotate(90deg) translateY(-50%)
        transition transform .15s ease-in-out
  &__main
    border 2px solid white
  &__content
    opacity 0
    visibility hidden
    max-height 0
    min-width 190px
    position absolute 100% 0 auto auto
    background white
    box-shadow: shadow
    &:before
    &:after
      content ''
      position absolute
      bottom 100%
      right 16px
      size 0
      border-style solid
      border-width 0 5px 5px 5px
      transition opacity .15s ease-in-out
      border-color transparent transparent white transparent
    &:before
      right 15px
      border-width 0 6px 6px 6px
      border-color: transparent transparent colors.borders transparent
    
  &--open
    .dropdown
      &__content
        opacity 1
        visibility visible
        max-height 50vh
    .dropdown
      &__toggle
        background: colors.bgs.body
        &:after
          transform rotate(270deg) translateY(-50%)
</style>