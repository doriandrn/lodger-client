<template lang="pug">
span.checkbox
  input(
    type=   "checkbox",
    :id=    "id"
    :value= "id"
    :selected=  "selected"
  )
  label.label(
    :for=       "id"
  ) #[span] {{ label }}
    p.field__desc(v-if="desc") {{desc}}

  slot
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false
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

