<template lang="pug">
span(
  :data-type=  "type !== 'text' ? type : null"
)
  labl.field__label(
    :for= "id",
    :label= "label",
    :required= "required"
    v-if="!noLabel"
  )
  input.field__input(
    :type=        "type", 
    :id=          "id",
    :placeholder= "noLabel ? label : placeholder",
    v-focus=      "focus",
    :autofocus=   "focus",
    :autocomplete= "autosuggest ? 'on' : 'off'"
    @input=       "emit($event)",
    :value=       "value",
    :min=         "type === 'number' ? min : null"
    :max=         "type === 'number' ? max : null"
    :step=         "type === 'number' ? step : null"
    @keyup.down=   "$emit('keyDown')"
    @keyup.up=    "$emit('keyUp')"
    @keyup.enter.prevent= "$emit('keyEnter')"
  )
  p.input__info(v-if="info") {{ info }}
  p.input__message.field__desc(v-if="message") {{ message }}
</template>

<script>
import labl from 'form/label'

export default {
  directives: {
    focus: {
      inserted: (el) => {
        if (!this.focus) return
        console.log('FOCUSIN', el)
        setTimeout(function () {
          el.focus()
        }, 250)
      }
    }
  },
  components: {
    labl
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: null
    },
    autosuggest: {
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
      default () {
        return ''
      }
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
      default () {
        return false
      }
    },
    message: {
      type: String,
      default () {
        return ''
      }
    },
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    size: {
      type: String,
      default () {
        return ''
      }
    },
    type: {
      type: String,
      default () {
        return 'text'
      }
    },
    label: {
      type: String,
      required: true,
      default () {
        return 'Input Label'
      }
    },
    error: {
      type: Boolean,
      default () {
        return false
      }
    },
    // Additional description
    info: {
      type: String,
      default () {
        return ''
      }
    },
    /* No Label enforces the input to display the label text as a placeholder */
    noLabel: {
      type: Boolean,
      default () {
        return false
      }
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
input[type="number"]
input[type="password"]
textarea
  font-size 14px
  line-height 18px
  border: 1px solid palette.borders
  border-radius 3px
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
