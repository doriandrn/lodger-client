<template lang="pug">
nuxt-link(
  v-if=         "to",
  :to=          "to",
  :data-icon=   "icon",
  :data-size=   "size",
) {{ text }}

button(
  v-else-if=    "type === 'button' && !to",
  @click=       "!dangerous ? $emit('click') : newPrompt(prompt)"
  :aria-label=  "$slots.default[0].text",
  :data-tip=    "tooltip ? text : false",
  :data-icon=   "icon",
  :data-size=   "size",
  :data-styl=   "styl",
  :data-dangerous=  "dangerous"
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

<style lang="stylus">
@require '~styles/config'

input[type="submit"]
button
.button
  background-color: config.palette.primary
  border: 1px solid config.palette.primary
  border-radius: config.radiuses.boxes
  color white
  cursor pointer

  &[data-size="large"]
    padding: config.spacings.inBoxes

  &[data-size="medium"]
    padding: (config.spacings.inBoxes/2)
  
  &[data-size="small"]
    padding: (config.spacings.inBoxes/4)

  &[data-dangerous="true"]
    background-color: config.palette.warn
    border-color: config.palette.warn

  &[data-styl="outline"]
    background-color transparent
    color: config.palette.primary
</style>


<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      prompted: 'prompt/prompted'
    }),
  },
  methods: {
    ...mapActions({
      newPrompt: 'prompt/new'
    })
  },
  watch: {
    prompted: function (newVal) {
      if (!this.dangerous) return
      if (!newVal) this.$emit('click')
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
      default () {
        return 'button'
      }
    },
    /*  Button Color
        Parameters: green | red | gray
        Default: none; -> blue
    */
    color: {
      type: String,
      default () {
        return ''
      }
    },
    /*  Button Icon
        Parameters: [ICONNAME]
        Default: none; -> doesn't use an icon
    */
    icon: {
      type: String,
      default () {
        return null
      }
    },
    iconOnly: {
      type: Boolean,
      default () {
        return false
      }
    },
    /*  Disabled?
        Parameters: true | false
        Default: false; -> blue
    */
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    /*  Stylings - transitions, effects, etc.
     *  Parameters
     */
    styl: {
      type: String,
      default () {
        return null
      }
    },
    /* Button Text */
    text: {
      type: String,
      default () {
        return 'A dummy button'
      }
    },
    /* Arrow (::After) */
    arrow: {
      type: [Boolean, String],
      default () {
        return null
      }
    },
    // tooltip position or bottom by default
    tooltip: {
      type: [Boolean, String],
      default () {
        return null
      }
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