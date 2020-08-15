<template lang="pug">
section(:class="{ sidebar: $slots.sidebar }")
  .inner
    slot(name="beforeTitle")
    h1(v-if="title") {{ title }}
    .inner__content(:class="{ boxes }")
      slot

    .inner__sidebar(v-if="$slots.sidebar")
      slot(name="sidebar")
</template>

<script>
export default {
  props: {

    boxes: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

section
  padding-top 24px
  padding-bottom 24px
  position relative
  overflow-x hidden

  &.sidebar
    > .inner
      flex-flow row nowrap !important
      align-items flex-start !important

    .inner
      &__sidebar
        flex 0 0 280px

  &#nuExista
    > .inner
      text-align center
      align-items center
      justify-content center

    h1
      color: config.palette.warn
</style>
