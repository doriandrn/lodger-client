<template lang="pug">
div(
  role= "checkboxgroup"
  :aria-labelledby= "id"
)
  labl(
    v-if=   "label"
    :label= "label"
    :for=   "id"
  ) {{ label }}
  span.cboxes(
    :id=              "id"
  )
    span.input__cbox(
      v-for=          "option, index in options"
    )
      input(
        type=       "checkbox",
        :value=     "index",
        :name=      "id",
        :disabled=  "option.disabled"
        :id=        "`${id}-${option}`",
        @change=    "$emit('change', Number(index))"
      )
      label.label(
        :for=   "`${id}-${option}`"
      ) #[span] {{ option }}
</template>

<script>
import labl from 'form/label'
export default {
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
    disabled: {
      type: Array,
      default: () => []
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
      type: Number,
      default: -1
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'


</style>
