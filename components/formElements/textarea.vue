<template lang="pug">
textarea(
  :id=          "id",
  :placeholder= "placeholder",
  :autofocus=   "focus",
  @input=       "$emit('input', $event.target.value)"
  :value=       "value"
)
</template>

<script>
export default {
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
      default: null
    },
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    focus: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus">
textarea
  max-width 100%
</style>
