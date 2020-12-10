<template lang="pug">
.dropdown(
  :class= "{ open }"
  v-on-clickaway=   "destroy"
  data-box-arrow
)
  buton(
    :icon=        "icon",
    :icon-only=   "iconOnly"
    @click=       "toggle"
    :arrow=       "arrow"
    :tabIndex=    "0"
    :shortkeys =  "toggleKeys"
    @shortkey=    "toggle"
  ) #[slot(name="beforeText")] {{ toggleText }}
    slot(name="buton")

  div
    header(v-if="$slots.header || (iconOnly && toggleText)")
      h6(v-if=  "iconOnly") {{ toggleText }}
      shortkeys(:keys="toggleKeys" v-if="toggleKeys")
      slot(name="header")

    main(v-if="$slots.default")
      slot

    footer(v-if="$slots.footer")
      slot(name="footer")
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import buton from 'form/button'
import shortkeys from 'c/shortkeys'

import { createPopper } from '@popperjs/core'
// import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js'
// import flip from '@popperjs/core/lib/modifiers/flip.js'

export default {
  data () {
    return {
      open: false
    }
  },
  components: {
    buton,
    shortkeys
  },
  methods: {
    toggle () {
      this.open ? this.destroy() : this.create()
    },
    create () {
      const { children } = this.$el
      const but = children[0]
      const drop = children[1]
      this.open = true
      this._popperInstance = createPopper(but, drop, {
        modifiers: [
          // preventOverflow,
          // flip,
          {
            name: 'offset',
            options: {
              offset: [0, 5]
            }
          }
        ],
      })
    },
    destroy () {
      if (this._popperInstance) {
        this.open = false
        this._popperInstance.destroy()
        this._popperInstance = null
        delete this._popperInstance
      }
    }
  },
  mixins: [clickaway],
  props: {
    toggleText: {
      type: String,
      default: 'Drop'
    },
    toggleKeys: {
      type: Array,
      default: null
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
  text-align center

  &+.dropdown
    z-index 106

  footer
    border-top: 1px solid colors.borders
    background: colors.bgs.body
    border-bottom-radius 30px

  header
    // border-top 3px solid white
    border-top-radius 12px
    border-bottom: 1px solid colors.borders
    background linear-gradient(180deg, white, #fafafa)
    padding 6px 12px
    position relative
    max-width 100%
    height: 40px;
    display: flex;
    align-items: center;

    p
      color rgba(black, .55)
      margin 0

  .list
    li
      padding-top 0
      padding-bottom 0

  h6
    margin-bottom 0

  > button
    color #666
    display flex
    align-items center
    font-weight 400
    font-size 13px
    height 100%
    position relative
    padding 0 12px
    min-height 40px

    &:hover
      background: colors.bgs.body

    &[data-arrow]
      &:after
        position relative
        mask-image embedurl('~static/icons/ui/chevron-down.svg')
        transition transform .15s ease-in-out

    //- &:focus
    //-   &+div
    //-     opacity 1
    //-     visibility visible


  main
    // border 2px solid white
    display flex
    flex-flow row wrap
    padding 8px
    background white
    // background: colors.bgs.body

    +above(m)
      padding 12px

    +above(l)
      padding 16px

    +above(xl)
      padding 20px

    &:last-child
      border-bottom-radius 10px
      box-shadow 0px 10px 100px -40px rgba(black, .2)

    > button
    > a
      &[data-styl="unstyled"]
        padding 4px 16px
        flex 1 1 100%
        justify-content flex-start
        border-radius 0

    span[data-type]:not(.sort)
      flex-flow row-reverse nowrap
      align-items center

      &:not(:last-child)
        margin-bottom 8px

      label
        margin-bottom 0
        margin-right 12px

  > div
    opacity 0
    visibility hidden
    // max-height 0
    min-width 200px
    position absolute
    // top calc(100% + 15px)
    // right 0
    overflow hidden
    // box-shadow: shadow
    // border-radius 2px 3px 5px 8px
    // transition top .15s ease-in-out, opacity .15s ease

  &[data-box-arrow]
    &:before
    &:after
      opacity 0

  &.open
    //- &[data-box-arrow]
    //-   &:before
    //-   &:after
    //-     bottom -5px
    //-     opacity 1

    > div
      opacity 1
      visibility visible
      max-height 50vh
      overflow visible
      //- top calc(100% + 5px)

    main
      > button
      > a
        &:hover
          background-color: colors.selectedItem

    > button
      pressed()

      &:after
        transform rotate(180deg)
</style>
