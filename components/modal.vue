<template lang="pug">
.modal(:class="{ 'modal--hasFooter': $slots.footer }")
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

  &__content
    flex 1 1 50%
    overflow-y auto

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
    max-height 75vh
    transition all .15s ease-in-out
    border-radius 2px
    box-shadow 0 1px 3px 0 rgba(black, .2)
    display flex
    flex-flow column nowrap
    
    +above(l)
      margin-top -5%

  &__content
    padding-top: config.spacings.betweenBoxes
    padding-bottom: config.spacings.betweenBoxes
    position relative

    form
      .actions
        margin: config.spacings.inBoxes -20px -20px
        padding: config.spacings.inBoxes config.spacings.betweenBoxes
        background: config.palette.borders

        input[type="submit"]
          min-width 120px

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