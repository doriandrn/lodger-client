<template lang="pug">
.empty
  h2.empty__heading(v-if="size === 'large'") {{ title }}
  h3.empty__heading(v-else) {{ title }}
  p {{ CTA }}
  .actions
    buton(
      v-for=  "traducere, metoda in actions",
      :key=   "metoda",
      :size=  "size",
      :styl=  "metoda === 'importaDate' ? 'outline' : null"
      @click= "handle(metoda)"
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
      default: 'Get started doing something'
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
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open',
      definesteStructura: 'asociatie/definesteStructura'
    }),
    newAsoc () {
      this.openModal('asocs.new')
    },
    handle (metoda) {
      if (typeof this[metoda] !== 'function') {
        this.debug('metoda', metoda)
        return
      }
      this[metoda]()
    }
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
