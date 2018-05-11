<template lang="pug">
transition(name="modal")
  .modal(
    :class= "{'modal--hasFooter': $slots.footer }"
    v-focus
  )
    .modal__backdrop(@click="inchide")
    .modal__container
      header.modal__header(v-if="$slots.header || title")
        slot(name="header")
        h2.modal__title(v-if="title") {{ title }}
      .modal__content(
        v-if=   "$slots.default",
        :class= "{ prompt: modalContent === 'prompt' }"
      )
        slot
      .modal__footer(v-if="$slots.footer")
        slot(name="footer")
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  methods: mapActions({
    inchide: 'modal/close'
  }),
  computed: mapGetters({
    modalContent: 'modal/content'
  }),
  directives: {
    focus: {
      componentUpdated: (el, binding) => {
        const firstInput = el.querySelector('input:not(.av)')
        if (firstInput) setTimeout(() => { firstInput.focus() }, 150)
      }
    }
  },
  props: {
    title: {
      type: String,
      default: 'Modal title'
    }
  }
}
</script>

<style lang="stylus">
@import '~styles/config'

lrPad = 32px

.modal
  position fixed 0
  z-index 200
  display flex
  align-items center
  justify-content center
  // opacity 0
  // visibility hidden
  transition all .15s ease-in-out

  &__backdrop
    position absolute 0
    z-index 201
    background rgba(white, .85)
    // opacity 0
    // visibility hidden
    transition opacity .15s ease-in-out

  &__container
    position absolute
    top calc(50% - 20px)
    left 50%
    z-index 202
    border: 1px solid config.palette.borders
    background white
    width 95%
    max-width 540px
    max-height 75vh
    transition all .15s ease-in-out
    border-radius 5px
    box-shadow 0 1px 235px -30px rgba(black, .2)
    display flex
    flex-flow column nowrap
    // opacity 0
    // visibility hidden
    transform-origin 0 0
    transform-style preserve3d
    transform scale(1, 1) translate(-50%,-50%)
    transition all .3s cubic-bezier(.165,.84,.44,1)

    +above(m)
      width 85%

  &__header
    background transparent

  &__content
    position relative
    flex 1 1 50%
    overflow visible
    padding 20px

    +above(xl)
      padding: lrPad

    form
      .actions
        flex-wrap nowrap
        position fixed
        bottom 0
        height 0
        margin 0
        // margin: config.spacings.inBoxes -20px -20px
        // padding: config.spacings.inBoxes config.spacings.betweenBoxes
        // background: config.palette.borders

        input[type="submit"]
          min-width 120px

  &__footer
  &__header
    padding-left 10px
    padding-right 10px
    +above(m)
      padding-left 16px
      padding-right 16px
    +above(xl)
      padding-left: lrPad
      padding-right: lrPad
  
  &__footer
  &__header
    padding-top: (config.spacings.inBoxes/2)
    padding-bottom: (config.spacings.inBoxes/2)

    +desktop()
      padding-top: config.spacings.inBoxes
      // padding-bottom: config.spacings.inBoxes
  &__title
    margin-bottom 0
  &__footer
    lost-utility clearfix
    background: config.palette.bgs.body

  
.modal
  &-enter
    opacity 0

  &-leave-active
    opacity: 0

  &-enter
  &-leave-active 
    .modal__container
      transform scale(.5, .5) translate(-50%, -50%)
      // transform: scale(1.1)
</style>