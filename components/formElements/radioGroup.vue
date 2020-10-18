<template lang="pug">
div(
  role= "radiogroup"
  :aria-labelledby= "id"
)
  labl(
    v-if=   "label"
    :label= "label"
    :for=   "id"
  ) {{ label }}
  span.radios(
    :id=              "id"
  )
    span(
      v-for=          "option, index in options"
      v-tooltip=      "{ content: tooltipData(option), placement: tooltipsPosition }"
    )
      input(
        type=       "radio",
        :value=     "index",
        :name=      "id",
        :disabled=  "option.disabled"

        :checked=   "Object.keys(value).indexOf(index) > -1 && value[index] > 0"
        :id=        "`${id}-${index}`",
        @change=    "$emit('change', index)"
        @click=     "$emit('click', { index, checked: Object.keys(value).indexOf(index) > -1 })"
      )
      label.label(
        :for=       "`${id}-${index}`"
      ) #[span] {{ option }}
      //- ) #[span] {{ options instanceof Array ? option : $t(option.label) }}
</template>

<script>
import labl from 'form/label'
export default {
  methods: {
    tooltipData (option) {
      const { label, desc } = option
      return `
        ${ label ? `<h6>${ this.$t(label) }</h6>`: ''}
        ${ desc ? `<p>${ this.$t(desc) }</p>`: ''}
      `
    },

  },
  computed: {
    tooltipsPosition () {
      const { id } = this
      if (id === 'initprgrs') return 'right'
      return 'top-center'
    },
    optionId () {
      return option => `${this.id}-${option && option.id ? option.id || option.label : this.index}`
    }
  },
  components: {
    labl
  },
  props: {
    options: {
      type: [Array, Object],
      default () {
        return {}
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
      default: null
    },
    value: {
      type: [Number, String, Object],
      default: -1
    }
  }
}
</script>
