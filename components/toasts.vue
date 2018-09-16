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
      p.bigger(v-if="typeof toast.text === 'string' && toast.text") {{ toast.text }}

    .toast__actions
      buton(
        icon=   "x"
        styl=   "unstyled"
        @click= "closeToast(toast.id)"
        icon-only
      ) Close
</template>

<script>
import { mapGetters } from 'vuex'
import buton from 'form/button'

export default {
  computed: {
    ...mapGetters({
      toasts: 'toastMessages'
    })
  },
  components: {
    buton
  },
  methods: {
    closeToast (id) {
      this.$store.dispatch('@@toast/REMOVE_TOAST_MESSAGE', id)
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

types = info warn error success
palette = config.palette
iconBgWidth = 22px

.toast
  &__title
    white-space nowrap
    margin-bottom 0
    flex 0 0 100%

    &+p
      margin-top 6px

  &__content
    display inline-block
    vertical-align top
    flex 1 1 100%
    max-width: calc(100% - 32px)

  &__actions
    margin-left 32px

.toasts
  position fixed
  bottom 32px
  left 32px
  max-width 280px
  z-index 2
  display flex
  flex-flow row wrap
  padding 0

  +above(m)
    max-width 340px

  +desktop()
    max-width 380px

  > li
    display flex
    flex-flow row nowrap
    align-items flex-start
    background: config.palette.bgs.dark
    border-radius 4px
    width auto
    padding 8px 12px
    position relative
    left 100%
    box-shadow 0px 6px 30px 4px rgba(black, .25)
    transition all .15s ease-in-out

    +above(m)
      padding 10px 20px

    +above(xl)
      padding 12px 24px

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
      color: config.typography.palette.light

      &.bigger
        font-size 14px
        font-weight 500
        line-height 20px

    &:before
      float left
      height: iconBgWidth
      mask-size: iconBgWidth - 2px
      margin-right 12px
      z-index 2
      flex: 0 0 iconBgWidth

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
