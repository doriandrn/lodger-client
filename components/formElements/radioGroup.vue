<template lang="pug">
span()
  labl(
    v-if=   "label"
    :label= "label"
  ) {{ label }}
  span.radios(
    :id=              "id"
    role=             "radiogroup"
    :aria-labelledby= "id"
  )
    span.input__radio(
      v-for=          "option, index in options"
    )
      input(
        type=       "radio",
        :value=     "index",
        :name=      "id",
        :checked=   "Number(index) === value",
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
      type: Object,
      default: {}
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
input[type="radio"]
  &+label
    > span
      border-radius 50%
  &:checked
    &+label
      > span
        background-image: embedurl('~static/icons/ui/circle.svg', 'utf8')
  &:hover
    cursor pointer

.input__radio
  display flex
  flex-flow column nowrap
</style>
