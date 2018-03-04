<template lang="pug">
label.label {{ label }} 
  span.input__req(v-if="required") *
</template>

<script>
export default {
  props: {
    required: {
      type: Boolean,
      default () {
        return false
      }
    },
    label: {
      type: String,
      default () {
        return 'A dummy label'
      }
    }
  }
}
</script>

<style lang="stylus">
label
  display inline-flex
</style>