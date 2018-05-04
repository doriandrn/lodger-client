<template lang="pug">
nuxt-link.button(
  v-if=         "to",
  :to=          "to",
  :data-icon=   "icon",
  :data-size=   "size",
  :data-styl=       "styl",
  tabIndex=     1
)
  slot

button(
  v-else-if=        "type === 'button' && !to",
  @click=           "!dangerous ? $emit('click', $event) : promptUser()"
  :disabled=        "disabled"
  :aria-label=      "$slots.default[0].text",
  :data-icon=       "icon",
  :data-size=       "size",
  :data-tip=        "!!tooltip"
  :data-styl=       "styl",
  :data-dangerous=  "dangerous"
  :data-arrow=      "arrow"
  :class=           "{ iconOnly, rounded }"
  tabIndex=     1
  )
  slot
  span.badge(v-if="$slots.badge")
    slot(name="badge")

  tooltip(
    v-if=   "tooltip"
    :text=  "typeof tooltip !== 'boolean' ? tooltip : null"
  )

input(
  v-else-if=    "type === 'submit'",
  type=         "submit",
  :value=       "$slots.default[0].text",
  :data-size=   "size",
  :disabled=    "disabled"
)
</template>

<style lang="stylus">
@require '~styles/config'

input[type="submit"]
button
.button
  background-color: config.palette.primary
  border: 1px solid config.palette.primary
  border-radius: config.radiuses.buttons
  // color: config.palette.primary
  color white
  cursor pointer
  transition all .15s ease-in-out
  display flex
  flex-flow row nowrap
  align-items center
  justify-content center
  font-size 13px
  line-height 20px
  flex-basis 56px
  white-space nowrap
  user-select none
  box-shadow -5px -5px #03A9F4

  &:before
    pointer-events none
    background-color white

  &:hover
  &:active
    border-color: config.palette.secondary

  &[disabled]
    cursor default
    border-color: config.palette.borders
    background-color transparent
    color: config.typography.palette.light
    box-shadow none

    &[data-arrow]
      &:after
        background-color: config.typography.palette.light

  &:not([disabled])
    &:not([data-styl="unstyled"])
      &:not([data-styl="outline"])
        &:hover
          background-color: darken(config.palette.primary, 15%)

  &[data-size="large"]
    padding: 15px 31px

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

  &[data-arrow]
    &:after
      background: config.typography.palette.light

</style>

<script>
import { mapActions, mapGetters } from 'vuex'
import tooltip from '~components/tooltip'

export default {
  data () {
    if (!this.dangerous) return {}
    return {
      prompted: false
    }
  },
  computed: {
    ...mapGetters({
      modalContent: 'modal/content',
      _prompted: 'prompt/prompted'
    })
  },
  components: {
    tooltip
  },
  methods: {
    ...mapActions({
      newPrompt: 'prompt/new'
    }),
    async promptUser () {
      this.prompted = true
      this.newPrompt(this.prompt)
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