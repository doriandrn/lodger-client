<template lang="pug">
sction#dash
  .widgets
    widget(full)
      h2 Luna în curs
      p Ramas de incasat

    widget(:boxed="false")
      buton(
        v-for=  "actiune in actiuni.adauga"
        :key=   "`adauga-${actiune}`"
        size=   "large"
        styl=   "square"
        :icon=  "actiune"
        @click= "openModal(`${actiune}.new`)"
      ) {{ $t(`dashboard.actions.${actiune}`) }}

</template>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import buton from 'form/button'
import butonIncaseaza from 'cc/butonIncaseaza'

import { mapGetters, mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      openModal: 'modal/open'
    })
  },
  computed: mapGetters({
    asociatieInitializata: 'asociatie/initializata'
  }),
  data () {
    return {
      actiuni: {
        adauga: [
          'incasare',
          'citireContor',
          'cheltuiala',
          'asociatie'
        ]
      }
    }
  },

  beforeCreate () {
    const { asociatieInitializata, debug, $router } = this
    if (asociatieInitializata) return
    debug('Asociatie neinitializata, redirectez')
    $router.replace({ path: 'initializare' })
  },
  components: {
    buton,
    butonIncaseaza,
    sction,
    widget
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
.widgets
  display flex
  flex-flow row wrap
  margin: -(config.spacings.inBoxes/2)

  +above(l)
    margin: -(config.spacings.inBoxes)

  > *
    flex 1 0 300px
    margin: (config.spacings.inBoxes/4)

    +above(l)
      margin: (config.spacings.inBoxes/2)

    +desktop()
      margin: config.spacings.inBoxes
</style>
