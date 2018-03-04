<template lang="pug">
span.checkbox
  input(
    type=   "checkbox",
    :id=    "id"
  )
  label.label(
    :for=       "id"
  ) #[span] {{ label }}
    p.field__desc(v-if="desc") {{desc}}
</template>

<script>
export default {
  props: {
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
    },
    desc: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang="stylus">
input[type="checkbox"]
  &+label
    > span
      border-radius 5px
  &:checked
    &+label
      >span
        background-image: embedurl('~static/icons/ui/ok.svg', 'utf8')
</style>
