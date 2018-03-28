<template lang="pug">
//- transition(name="modal")
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

.modal
  position fixed 0
  z-index 200
  display flex
  align-items center
  justify-content center
  opacity 0
  visibility hidden
  transition all .15s ease-in-out

  &__content
    flex 1 1 50%
    overflow-y auto
    overflow-x hidden

  &__backdrop
    position absolute 0
    z-index 201
    background rgba(white, .85)
    opacity 0
    visibility hidden
    transition opacity .15s ease-in-out

  &__container
    position absolute
    top 50%
    left 50%
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
    opacity 0
    visibility hidden
    transform-origin 0 0
    transform-style preserve3d
    transform scale(.5,.5) translate(-50%,-50%)
    transition all .3s cubic-bezier(.165,.84,.44,1)

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

  &Open
    overflow hidden
    
    .modal
      z-index 10000000
      opacity 1
      /*visibility visible*/
      &__backdrop
        z-index 1
        opacity 1
        visibility visible
        
        &:hover
          .modal
            &__close
              transform scale(1.5,1.5)!important
        
      &__close
        z-index 2
        opacity 1
        visibility visible
        transform scale(1,1)
        
      &__container
        z-index 2
        visibility visible
        transform scale(1,1) translate(-50%,-50%)
        opacity 1
  
// .modal
//   &-enter
//     opacity 0

//   &-leave-active
//     opacity: 0

//   &-enter
//   &-leave-active 
//     .modal__container
//       transform scale(.5,.5) translate(-50%,-50%)
//       // transform: scale(1.1)
</style>