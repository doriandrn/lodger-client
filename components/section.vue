<template lang="pug">
section
  .inner
    h1 {{ title }}
    slot
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'O pagină'
    }
  }
}
</script>

<style lang="stylus">
section
  padding-top 24px
  padding-bottom 24px
</style>
