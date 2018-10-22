<template lang="pug">
nuxt-link.button(
  v-if=         "to",
  :to=          "to",
  :data-icon=   "icon",
  :class=           "{ iconOnly, rounded }"
  :data-size=   "size",
  :data-styl=   "styl",
  :tabIndex=    "tabIndex"
  :data-arrow=      "arrow"
  :title=      "$slots.default[0].text",
)
  slot

button(
  v-else-if=        "type === 'button' && !to",
  type=             "button"
  @click=           "handleClick"
  :disabled=        "disabled"
  :aria-label=      "$slots.default[0].text",
  :data-icon=       "icon",
  :data-size=       "size",
  :data-tip=        "!!tooltip"
  :data-styl=       "styl",
  :data-dangerous=  "dangerous"
  :data-arrow=      "arrow"
  :class=           "{ iconOnly, rounded }"
  @keyup.up=        "$emit('keyUp', $event)"
  tabIndex=         0
  v-tooltip=        "_tooltip"
)
  slot
  span.badge(v-if="$slots.badge")
    slot(name="badge")

input(
  v-else-if=    "type === 'submit'",
  type=         "submit",
  :value=       "$slots.default[0].text",
  :data-size=   "size",
  :disabled=    "disabled"
)
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import tooltip from 'c/tooltip'

export default {
  data () {
    if (!this.dangerous) return {}
    return {
      prompted: false
    }
  },
  computed: {
    _tooltip () {
      const { tooltip, debug } = this
      if (!tooltip) return

      const { text } = this.$slots.default[0]
      if (typeof tooltip === 'boolean') return text
      let content = ''

      Object.keys(tooltip).forEach(k => {
        const icon = (k => {
          if (k === 'suprafata') return 'square'
        })(k)
        if (tooltip[k] !== undefined) content += `<li ${icon ? `data-icon="${icon}"` : ''} data-type="${k}">${k === 'proprietar' ? `<h6>${tooltip[k]}</h6>` : tooltip[k]}</li>`
      })
      return `<ul class="tooltip__list">${ content }</ul>`
    },
    focusing () {
      if (!document) return
      const { activeElement } = document
      if (!activeElement) return
      return activeElement === this.$el
    },
    ...mapGetters({
      modalContent: 'modal/content',
      _prompted: 'prompt/prompted'
    })
  },
  methods: {
    ...mapActions({
      newPrompt: 'prompt/new'
    }),
    async promptUser () {
      this.prompted = true
      this.newPrompt(this.prompt)
    },
    handleClick (e) {
      const { dangerous, disabled, promptUser } = this
      if (disabled) return
      if (dangerous) {
        promptUser()
        return
      }
      this.$emit('click', e)
    }
  },
  watch: {
    _prompted: function (newVal) {
      if (!this.prompted) return
      if (!newVal) {
        this.$emit('click', this.$event)
        this.prompted = false
      }
    }
  },
  props: {
    /*  Button Size
        Parameters: small | medium | large;
        Default: none
    */
    size: {
      type: String,
      default: 'medium'
    },
    prompt: {
      type: Object,
      default () {
        return {
          type: 'warning',
          message: this.$t('defaults.prompt.message')
        }
      }
    },
    dangerous: {
      type: Boolean,
      default: null
    },
    tabIndex: {
      type: Number,
      default: 0
    },
    /*  Type
        Parameters: button | submit;
        Default: button
    */
    type: {
      type: String,
      default: 'button'
    },
    /*  Button Color
        Parameters: green | red | gray
        Default: none; -> blue
    */
    color: {
      type: String,
      default: null
    },
    /*  Button Icon
        Parameters: [ICONNAME]
        Default: none; -> doesn't use an icon
    */
    icon: {
      type: String,
      default: null
    },
    iconOnly: {
      type: Boolean,
      default: null
    },
    rounded: {
      type: Boolean,
      default: null
    },
    /*  Disabled?
        Parameters: true | false
        Default: false; -> blue
    */
    disabled: {
      type: Boolean,
      default: null
    },
    /*  Stylings - transitions, effects, etc.
     *  Parameters
     */
    styl: {
      type: String,
      default: null
    },

    /* Arrow (::After) */
    arrow: {
      type: [Boolean, String],
      default: null
    },
    // tooltip position or bottom by default
    tooltip: {
      type: [Boolean, String, Object],
      default: null
    },
    /* link to nuxt page */
    to: {
      type: [String, Object],
      default () {
        return null
      }
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
// butTextColor = config.palette.primary
butTextColor = #253a63

input[type="submit"]
button
.button
  position relative
  background-color white
  border: 1px solid config.palette.borders
  border-radius: config.radiuses.buttons
  color: butTextColor
  // color white
  cursor pointer
  transition all .15s ease-in-out
  display flex
  font-family: config.typography.fams.ui
  flex-flow row nowrap
  align-items center
  justify-content center
  font-size 13px
  line-height 20px
  white-space nowrap
  user-select none
  max-width 300px
  // box-shadow inset 0 1px rgba(white, .5)
  box-shadow 0 1px rgba(black, .05)
  font-smoothing antialiased

  &:before
    pointer-events none
    background-color: butTextColor

  &:not(:disabled)
    &:hover
    &:focus
    &:active
      border-color: config.palette.secondary
      top 1px

  &:disabled
    cursor default
    cursor not-allowed
    border-color: config.palette.borders
    background-color transparent
    color: config.typography.palette.light
    box-shadow none

    &[data-arrow]
      &:after
        background-color: config.typography.palette.light

    &[data-icon]
      &:before
        background-color: config.typography.palette.light

      &.iconOnly
        font-size 0
        

    &:hover
    &:focus
    &:active
      &[data-arrow]:after
      &[data-icon]:before
        background-color: config.typography.palette.light

  &[data-arrow]
    &:after
      mask-image embedurl('~static/icons/ui/arrow-down.svg')
      background-color: butTextColor

  &[data-size="large"]
    padding: 16px 31px
    // flex-basis 40px

    &[data-styl="square"]
      flex-flow column nowrap
      text-transform capitalize

      &:before
        size 24px
        mask-size 24px
        margin-right 0
        margin-bottom 8px

  &[data-size="medium"]
    padding: (config.spacings.inBoxes/2) config.spacings.inBoxes
  
  &[data-size="small"]
    padding: (config.spacings.inBoxes/4) (config.spacings.inBoxes/2)

  &[data-dangerous="true"]
    background-color: config.palette.warn
    border-color: config.palette.warn

    &[data-styl="outline"]
      &[data-icon]
        &:before
          background-color: config.palette.warn


  &[data-styl="outline"]
  &[data-styl="unstyled"]
    background-color transparent
    color: config.typography.palette.ui
    box-shadow none

    &:before
    &:after
      background-color: config.typography.palette.ui

    &:hover
      color: config.palette.primary

      &:before
      &:after
        background-color: config.palette.primary
  
  &[data-styl="unstyled"]
    border 0
    padding 0

  &[data-styl="outline"]
    color: config.palette.primary

    &:before
      background-color: config.palette.primary

    &:hover
      background transparent

  &.rounded
    border-radius 50%

</style>
