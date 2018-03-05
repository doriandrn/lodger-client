<template lang="pug">
div(:data-type="type")
  p.prompt__message {{ message }}
  .actions.split
    .left
      buton(
        @click= "confirmPrompt",
        styl=   "outline"
      ) {{ $t('defaults.prompt.confirm') }}

    .right
      buton(@click="cancelPrompt") {{ $t('defaults.prompt.cancel') }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import buton from 'form/button'

export default {
  computed: mapGetters({
    type: 'prompt/type',
    message: 'prompt/message'
  }),
  methods: mapActions({
    confirmPrompt: 'prompt/confirm',
    cancelPrompt: 'modal/close'
  }),
  components: {
    buton
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.prompt
  padding-left 90px
  padding-top: config.spacings.inBoxes
  padding-bottom: config.spacings.inBoxes
  
  &__message
    font-size 16px
    line-height 20px
    margin-bottom: config.spacings.betweenBoxes
    color black

  [data-type]
    &:before
      content ''
      position absolute
      left 0
      top 0
      bottom 0
      width 3px

    &:after
      content ''
      position absolute
      left 3px
      top 0
      bottom 0
      width 64px
      background-repeat no-repeat
      background-size 36px
      background-position 24px 12px

  div[data-type="warning"]
    &:before
      border-left: 3px solid config.palette.warn

    &:after
      background-image: embedurl('~static/icons/ui/alert-triangle.svg')
</style>
