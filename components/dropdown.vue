<template lang="pug">
.dropdown(
  :class=   "{'dropdown--open': open}",
  v-on-clickaway=   "inchide"
)
  buton.dropdown__toggle(
    :icon=    "icon",
    :icon-only= "iconOnly"
    @click=   "open = !open",
    :arrow=   "arrow"
    styl=     "unstyled"
    tabIndex= 0
  ) #[slot(name="beforeText")] {{ toggleText }}
    slot(name="buton")
  .dropdown__content(data-box-arrow)
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
        transition transform .15s ease-in-out
  &__main
    border 2px solid white
    display flex
    flex-flow row wrap

    padding 8px 0

    > button[data-styl="unstyled"]
      padding 4px 16px
      flex 1 1 100%
      justify-content flex-start

  &__content
    opacity 0
    visibility hidden
    max-height 0
    min-width 190px
    position absolute 100% 0 auto auto
    background white
    box-shadow: shadow
    
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
          transform rotate(180deg)
</style>