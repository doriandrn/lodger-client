<template lang="pug">
span
  labl.field__label(
    :for=       "id",
    :label=     "label",
    :required=  "required"
  )
  textarea.field__input(
    :id=          "id",
    :placeholder= "noLabel ? label : placeholder",
    :autofocus=   "focus",
    @input=       "emit($event)"
    :value=       "value"
  )
</template>

<script>
import labl from 'form/label'

export default {
  components: {
    labl
  },
  props: {
    value: {
      type: String,
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
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    label: {
      type: String,
      required: true,
      default () {
        return 'Input Label'
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
  }
}
</script>
