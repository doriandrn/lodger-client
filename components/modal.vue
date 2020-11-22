<template lang="pug">
transition(name="modal")
  .modal(
    v-show=     "$lodger.modal.activeDoc"
    :data-tax=  "$lodger.modal.activeDoc ? $lodger.modal.activeDoc.collection.name : undefined"
    :class=     "{ 'hasFooter': $slots.footer, overflow, editing: editing || $lodger.modal.activeDoc && $lodger.modal.activeDoc._isTemporary }"
    v-focus=    "editing && $lodger.modal.activeDoc"
  )
    .backdrop(@click="inchide")

    slot(name="beforeContainer")
    .container
      main.content
        slot
        single(
          v-if= "$lodger.modal.activeDoc"
          :doc= "$lodger.modal.activeDoc"
          :editing= "editing || $lodger.modal.activeDoc._isTemporary"
        )
          buton.lock(
            v-if=     "!$lodger.modal.activeDoc._isTemporary"
            :icon=    "editing ? 'lock' : 'unlock'"
            @click=   "editing = !editing"
            iconOnly
          ) {{ $lodger.i18n.edit }}
    slot(name="afterContainer")
</template>

<script>
import { Observer } from 'mobx-vue'
import single from 'c/single'
import buton from 'form/button'

export default Observer({
  data () {
    return {
      editing: false
    }
  },
  directives: {
    focus: {
      componentUpdated: (el, binding) => {
        // if (!this.editing) // this nu e aici
        //   return

        const firstInput = el.querySelector('input:not(.av):not([type="file"]):not(:disabled)')
        console.log('FIRST INPUT', firstInput)
        if (firstInput) setTimeout(() => { firstInput.focus() }, 450)
      }
    }
  },
  methods: {
    inchide () {
      this.editing = false
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
  },
  components: {
    single,
    buton
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

    +above(l)
      max-width 640px

  &.editing
    #single
      padding-top 12px

    .container
      background-color #f5f7fb

  header
    background transparent

  .content
    position relative
    flex 1 1 100%
    padding 20px

    +above(xl)
      padding: lrPad

    .form


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
    max-width 100%

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
