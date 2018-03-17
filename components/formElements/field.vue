<template lang="pug">
.field(
  :data-size=  "size"
  :data-type=   "type"
)
  labl.field__label(
    :required=    "required"
    :for=         "id"
  ) {{ label }}

  inpt(
    v-if=         "['text', 'number', 'search', 'bani'].indexOf(type) > -1",
    :type=        "type !== 'bani' ? type : 'number'",
    :placeholder= "placeholder",
    :autocomplete="autocomplete",
    :id=          "id",
    :focus=       "focus",
    :required=    "required",
    :min=         "min",
    :max=         "max",
    :step=        "type !== 'bani' ? step : .01",
    :value=       "value",
    @input=       "$emit('input', type === 'number' ? Number($event) : $event)",
    @change=      "$emit('change', $event)"
  )
  txtarea(
    v-else-if=    "['textarea'].indexOf(type) > -1"
    :placeholder= "placeholder",
    :value=       "value",
    @input=       "$emit('input', $event)"
    :required=    "required",
    :id=          "id",
  )
  slect(
    v-else-if=    "type === 'select'"
    :options=     "options"
    :value=       "value",
    :required=    "required",
    @input=       "$emit('input', $event)"
    :id=          "id"
  )
  scari(
    v-else-if=    "type === 'array' && typeof scariCount !== 'undefined'",
    :scariCount=  "scariCount" 
    :value=       "value",
    @input=       "$emit('input', $event)"
  )
  radios(
    v-else-if=    "type === 'radios'",
    :id=          "id",
    :value=       "value",
    @change=      "$emit('input', $event)"
    :options=     "options"
  )
  search(
    v-else-if=    "type === 'search'",
    :value=       "value",
    @gasit=       "$emit('input', $event)"
  )

  p.field__message(v-if="message") {{ message }}

  slot
</template>

<script>
import inpt from 'form/input'
import labl from 'form/label'
import slect from 'form/select'
import txtarea from 'form/textarea'
import cbox from 'form/checkbox'
import file from 'form/file'
import radios from 'form/radioGroup'
import scari from 'form/scari'
import search from '~components/search'

export default {
  name: 'field',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: 'NOID!'
    },
    label: {
      type: String,
      default: 'Field Label'
    },
    /* Hide Label enforces the input to display the label text as a placeholder */
    hideLabel: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    focus: {
      type: Boolean,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    scariCount: {
      type: Number,
      default: null
    },
    value: {
      type: [Boolean, String, Array, Object, Number],
      default: null
    },
    // Additional description
    message: {
      type: String,
      default: null
    },
    // 4 selects
    options: {
      type: [Array, Object],
      default () {
        return {}
      }
    },
    autocomplete: {
      type: Boolean,
      default: true
    }
  },
  components: {
    inpt,
    slect,
    labl,
    txtarea,
    cbox,
    file,
    radios,
    scari,
    search
  }
}
</script>

<style lang="stylus">
.field
  &[data-size="small"]
    input
      padding 4px
      border-radius 24px

  &[data-icon]
    input
      padding-left 32px !important
</style>
