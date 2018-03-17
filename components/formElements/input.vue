<template lang="pug">
input(
  :type=            "type", 
  :id=              "id",
  :placeholder=     "placeholder",
  v-focus=          "focus",
  :autofocus=       "focus",
  :autocomplete=    "autocomplete ? 'on' : 'off'"
  @input=           "emit($event)",
  :value=           "value",
  :min=             "type === 'number' ? min : null"
  :max=             "type === 'number' ? max : null"
  :step=            "type === 'number' ? step : null"
  @keyup.down=      "$emit('keyDown')"
  @keyup.up=        "$emit('keyUp')"
  @keyup.enter.prevent= "$emit('keyEnter')"
)
</template>

<script>
export default {
  directives: {
    focus: {
      inserted: (el) => {
        if (!this.focus) return
        setTimeout(() => { el.focus()}, 250)
      }
    }
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: null
    },
    autocomplete: {
      type: Boolean,
      default: true,
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    step: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'UnIdNedefinit'
    },
    size: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    error: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emit (e) {
      let { value } = e.target
      if (!value) value = null
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
palette = config.palette

input[type="text"]
input[type="search"]
input[type="number"]
input[type="password"]
textarea
  font-size 14px
  line-height 18px
  border: 1px solid palette.bgs.body
  border-radius: config.radiuses.buttons
  box-shadow inset 1px 2px 3px -1px rgba(black, .015) 
  transition all .15s ease-in-out
  background: palette.bgs.body
  padding 8px 12px
  width 100%

  &::placeholder
    color: config.typography.palette.meta
    font-size 12px
    font-weight 100
  
  &:focus
    border-color: palette.primary
    color: palette.primary

.input
  &__req
    color: palette.warn
    margin-left 4px
</style>
