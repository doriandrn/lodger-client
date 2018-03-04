<template lang="pug">
span(:id="id")
  labl {{ label }}
  span.radios
    span.input__radio(
      v-for=      "option, index in options"
    )
      input(
        type=     "radio",
        :value=   "option",
        :checked= "picked === index",
        :id=      "`${id}-${option}`",
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
      type: Array,
      default: []
    },
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    label: {
      type: String,
      default () {
        return ''
      }
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
</style>
