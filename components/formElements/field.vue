<template lang="pug">
inpt(
  v-if=         "['text', 'number'].indexOf(type) > -1",
  :type=        "type",
  :label=       "label",
  :placeholder= "placeholder",
  :id=          "id",
  :focus  =     "focus",
  :required=    "required",
  :min=         "min",
  :max=         "max",
  :step=        "step"
  :value=       "value",
  @input=       "$emit('input', type === 'number' ? Number($event) : $event)"
)
txtarea(
  v-else-if=    "['textarea'].indexOf(type) > -1"
  :label=       "label",
  :placeholder= "placeholder",
  :value=       "value",
  @input=       "$emit('input', $event)"
  :required=    "required",
  :id=          "id",
)
slect(
  v-else-if=    "type === 'select'"
  :options=     "options"
  :label=       "label",
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
  :value=       "value",
  @input=       "$emit('input', $event)"
  :options=     "options"
  :label=       "label"
)
search(
  v-else-if=    "type === 'search'",
  :value=       "value",
  @gasit=       "$emit('input', $event)"
)
</template>

<script>
import inpt from 'form/input'
import slect from 'form/select'
import txtarea from 'form/textarea'
import cbox from 'form/checkbox'
import file from 'form/file'
import radios from 'form/radioGroup'
import scari from 'form/scari'
import search from '~components/search'

export default {
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
    scariCount: {
      type: Number,
      default: null
    },
    value: {
      type: [Boolean, String, Array, Object, Number],
      default: null
    },
    // 4 selects
    options: {
      type: [Array, Object],
      default () {
        return {}
      }
    }
  },
  components: {
    inpt,
    slect,
    txtarea,
    cbox,
    file,
    radios,
    scari,
    search
  }
}
</script>
