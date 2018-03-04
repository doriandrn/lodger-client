<template lang="pug">
.modal()
  .modal__backdrop(@click="inchide")
  .modal__container
    header.modal__header(v-if="$slots.header || title")
      slot(name="header")
      h2.modal__title(v-if="title") {{ title }}
    .modal__content(
      v-if=   "$slots.default"
      :class= "{prompt: modalContent}"
    )
      slot
    .modal__footer(v-if="$slots.footer")
      slot(name="footer")
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: mapActions({
    inchide: 'modal/close',
    modalContent: 'modal/content'
  }),
  props: {
    title: {
      type: String,
      default: 'Modal title'
    }
  },
  mounted () {
    const firstInput = this.$el.querySelector('input[type="text"]')
    if (firstInput) firstInput.focus()
  }
}
</script>

<style lang="stylus">
@import '~styles/config'

.modal
  position fixed 0
  z-index 200
  display flex
  align-items center
  justify-content center
  transition all .15s ease-in-out

  &__backdrop
    position absolute 0
    z-index 201
    background rgba(white, .85)

  &__container
    position relative
    z-index 202
    border: 1px solid config.palette.borders
    background white
    width 85%
    max-width 540px
    transition all .15s ease-in-out
    border-radius 2px
    box-shadow 0 1px 3px 0 rgba(black, .2)
    +above(l)
      margin-top -25%

  &__content
    padding-top: config.spacings.betweenBoxes
    padding-bottom: config.spacings.betweenBoxes
    position relative

  &__content
  &__footer
  &__header
    padding-left 10px
    padding-right 10px
    +above(m)
      padding-left 16px
      padding-right 16px
    +above(l)
      padding-left 32px
      padding-right 32px
  &__footer
  &__header
    padding-top: config.spacings.inBoxes
    padding-bottom: config.spacings.inBoxes
  &__title
    margin-bottom 0
  &__footer
    lost-utility clearfix
    background: config.palette.bgs.body
  
</style>