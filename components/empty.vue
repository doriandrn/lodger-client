<template lang="pug">
.empty
  .empty__ilstr(:data-for="_for") ilustratie
  h2.empty__heading(v-if="title && size === 'large'") {{ title }}
  h3.empty__heading(v-else-if="title && size !== 'large'") {{ title }}
  p(v-if="CTA") {{ CTA }}
  .actions
    buton(
      v-for=  "traducere, metoda, index in actions",
      :key=   "metoda",
      :size=  "size",
      :styl=  "index === 0 ? 'outline' : null"
      @click= "$emit('action', metoda)"
    ) {{ traducere }}
</template>

<script>
import buton from 'form/button'
import { mapActions } from 'vuex'

export default {
  props: {
    _for: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    CTA: {
      type: String,
      default: null
    },
    actions: {
      type: Object,
      default () {
        return {
          metoda: 'traducere'
        }
      }
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  components: {
    buton
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
.empty
  display flex
  flex-flow column nowrap
  align-items center
  justify-content center
  flex 1 1 100%

  &__heading + p
    margin-bottom: config.spacings.betweenBoxes

  > .actions
    justify-content center
    flex-basis auto !important

  &__ilstr
    width 380px
    height 200px
    background-size cover
    background-repeat no-repeat
    
    &[data-for="noasoc"]
      background-image embedurl('~static/ils/illustration-emptystate-desk.png')
</style>
