<template lang="pug">
span
  labl.field__label(
    :for= "id",
    :label= "label",
    :required= "required"
  )
  input.field__input(
    :type=        "type", 
    :id=          "id",
    :placeholder= "noLabel ? label : placeholder",
    v-focus=      "focus",
    :autofocus=   "focus",
    @input=       "emit($event)",
    :value=       "value"
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
      type: [Boolean, String],
      default () {
        return ''
      }
    },
    name: {
      type: String,
      default () {
        return ''
      }
    },
    placeholder: {
      type: String,
      default () {
        return ''
      }
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
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
palette = config.palette

input[type="text"]
input[type="password"]
textarea
  font-size 14px
  line-height 18px
  border: 1px solid palette.borders
  border-radius 6px
  transition all .15s ease-in-out
  background: palette.bgs.body
  padding 8px 12px
  width 100%
  
  &:focus
    border-color: palette.primary
    color: palette.primary
</style>
