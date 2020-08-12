<template lang="pug">
transition(name="modal")
  .modal(
    v-show=     "$lodger.modal.activeDoc"
    :data-tax=  "$lodger.modal.tax"
    :class= "{'hasFooter': $slots.footer, overflow}"
    v-focus
  )
    .backdrop(@click="inchide")

    slot(name="beforeContainer")
    .container
      main.content
        slot
        single(
          v-if= "$lodger.modal.activeDoc"
          :doc= "$lodger.modal.activeDoc"
        )
    slot(name="afterContainer")
</template>

<script>
import { observer } from 'mobx-vue'
import single from 'c/single'

export default observer({
  computed: {
    shouldOverflow () {
      return this.modalContent === 'incasare.new'
    },
    // doc () {
    //   return this.$lodger.modal.activeDoc
    // }
  },
  directives: {
    focus: {
      componentUpdated: (el, binding) => {
        const firstInput = el.querySelector('input:not(.av)')
        if (firstInput) setTimeout(() => { firstInput.focus() }, 150)
      }
    }
  },
  methods: {
    inchide () {
      this.$lodger.modal.close()
    }
  },
  props: {
    overflow: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Modal title'
    }
  },
  components: {
    single
  }
})
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

  .backdrop
    position absolute 0
    z-index 201
    background rgba(white, .85)
    // opacity 0
    // visibility hidden
    transition opacity .15s ease-in-out

  .container
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

  header
    background transparent

  .content
    position relative
    flex 1 1 100%
    padding 20px

    +above(xl)
      padding: lrPad

    .form
      +desktop()
        margin-top -12px

      &__content
        margin: 0px (-(config.spacings.inBoxes/2)) -36px

        +desktop()
          margin: 0 (-(config.spacings.inBoxes)) -36px

        > .field
          flex 1 1 200px
          margin: 0 (config.spacings.inBoxes/2) 36px

          +desktop()
            margin: 0 config.spacings.inBoxes 36px

      .actions
        flex-wrap nowrap
        position fixed
        bottom -48px
        width auto !important
        right 10px
        left 10px
        margin 0
        // margin: config.spacings.inBoxes -20px -20px
        // padding: config.spacings.inBoxes config.spacings.betweenBoxes
        // background: config.palette.borders

        +desktop()
          left 30px

        input[type="submit"]
          min-width 120px

  &.overflow
    .content
      overflow visible

  footer
  header
    padding-left 10px
    padding-right 10px
    +above(m)
      padding-left 16px
      padding-right 16px
    +above(xl)
      padding-left: lrPad
      padding-right: lrPad

  footer
  header
    padding-top: (config.spacings.inBoxes/2)
    padding-bottom: (config.spacings.inBoxes/2)

    +desktop()
      padding-top: config.spacings.inBoxes
      padding-bottom: config.spacings.inBoxes

  h2
    margin-bottom 0

  footer
    lost-utility clearfix
    background: config.palette.bgs.body

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
