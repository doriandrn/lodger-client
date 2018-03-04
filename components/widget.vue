<template lang="pug">
.widget(:class="{boxed, full}")
  header.widget__header(
    v-if= "boxed"
    :data-icon= "icon"
  )
    h4.widget__title {{ title }}
  .widget__content
    slot
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Widget Title'
    },
    boxed: {
      type: Boolean,
      default: true
    },
    full: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
.widget
  position relative
  overflow hidden

  &__content
    min-height 300px

  &__title
    text-transform uppercase
    font-weight 500
    letter-spacing .5px
    margin-bottom 0

  &.full
    flex 1 1 100%

  &.boxed
    background white
    border-radius: config.radiuses.boxes
    box-shadow: config.shadows.boxes

    .widget
      &__content
        padding: config.spacings.inBoxes
      
      &__title
        padding: 0 config.spacings.inBoxes


</style>
