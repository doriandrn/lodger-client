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
      role=           "radio"
      :aria-chcked=   "picked === index"
      :tabindex=      "picked === index ? 0 : -1"
    )
      input(
        type=     "radio",
        :value=   "option",
        :checked= "picked === index",
        :name=     "id",
        :id=      "`${id}-${option}`"
        @change=   "$emit('change', index)"
      )
      label.label(
        :for=   "`${id}-${option}`"
      ) #[span] {{option}}
</template>

<script>
import labl from 'form/label'
export default {
  components: {
    labl
  },
  props: {
    picked: {
      type: Number,
      default: -1
    },
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

.input__radio
  display flex
  flex-flow column nowrap
</style>
