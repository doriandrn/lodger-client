<template lang="pug">
ul.toasts(
  :class=   "{ 'toasts--has': toasts.length > 0 }"
)
  li(
    v-for=      "toast in toasts",
    :key=       "toast.id",
    :data-type= "toast.type",
    :data-icon=  "toast.type === 'success' ? 'check' : 'alert-circle'"
  )
    .toast__content
      h5.toast__title(v-if="toast.text.heading") {{ $t( toast.text.heading ) }}
      p(v-if="toast.text.text") {{ $t( toast.text.text ) }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      toasts: 'toastMessages'
    })
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

types = info warn error success
palette = config.palette
iconBgWidth = 20px

.toast
  &__title
    white-space nowrap
    margin-bottom 0
    flex 0 0 100%

    &+p
      margin-top 6px

  &__content
    display inline-flex
    flex-flow row wrap
    align-items flex-start

.toasts
  position fixed
  top 70px
  right 0
  max-width 280px
  z-index 2
  display flex
  flex-flow column wrap
  padding 0

  +above(m)
    max-width 340px

  +desktop()
    max-width 380px

  > li
    display flex
    flex-flow row nowrap
    align-items center
    background white
    border-left 1px solid
    width auto
    padding 8px 24px 8px 12px
    position relative
    left 100%
    transition all .15s ease-in-out

    // &:after
    //   content ''
    //   position absolute
    //   left 0
    //   top 0
    //   bottom 0
    //   width: iconBgWidth
    //   z-index 1
    
    &:not(:last-child)
      margin-bottom 20px

    p
      margin-bottom 0
      color: config.typography.palette.meta

    &:before
      flex-basis: iconBgWidth
      height: iconBgWidth
      mask-size 14px
      flex-shrink 0
      margin-right 12px
      z-index 2

    for $type in types
      type = s("%s", $type)
      dcolor = palette[type]

      &[data-type=\"{$type}\"]
        border-left-color: dcolor
        // box-shadow: 0px 2px 5px -2px dcolor

        &:before
          background-color: dcolor

        &:after
          background: lighten(dcolor, 95%)

  &--has
    > li
      left 0

</style>
