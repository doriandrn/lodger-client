<template lang="pug">
.empty
  .empty__heading(v-if="title")
    h2(v-if="size === 'large'") {{ title }}
    h3(v-else) {{ title }}
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
</style>
