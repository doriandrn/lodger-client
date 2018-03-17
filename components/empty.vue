<template lang="pug">
.empty
  h2.empty__heading(v-if="size === 'large'") {{ title }}
  h3.empty__heading(v-else) {{ title }}
  p {{ CTA }}
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
    title: {
      type: String,
      default: 'This is an empty state!'
    },
    CTA: {
      type: String,
      default: 'Get started doing nothing'
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
</style>
