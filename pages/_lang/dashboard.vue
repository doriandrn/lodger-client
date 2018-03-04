<template lang="pug">
sction#dash
  div(v-if="asociatii.length")
    h1 {{ $t('dashboard.title') }}

    .widgets
      widget.actions(
        :title="$t('dashboard.actions.title')"
        :boxed="false"
        v-if=   "asociatieInitializata"
      )
        p Typography check
        buton(
          icon=   "add"
        ) {{ $t('dashboard.actions.cashIn') }}

      widget(
        :title= "$t('dashboard.statistics.title')"
        v-if=   "asociatieInitializata"
      )
        h4 Rămas de încasat

      widget(
        :title= "$t('dashboard.activity.title')"
        v-if=   "asociatieInitializata"
      )

      //- widget.joaca(title="joaca", full)
        p ccucuuc

      widget(title="structura")
        h4(v-if="structura.length")
        empty(
          v-else,
          :title=   "$t('blocs.none.heading')",
          :CTA=     "$t('blocs.none.CTA')",
          :actions= "{ definesteStructura: $t('blocs.none.actions[0]'), importaDate: $t('blocs.none.actions[1]') }"
        ) gol


      widget(
        title="zona administrativa"
        icon= "settings"
      )
        h2 danger zon
        buton(
          dangerous,
          @click= "stergeAsociatie(activaId)",
          :prompt= "{ type: 'warning', message: 'da ma?'}"
        ) sterge asociatia
  empty(
    v-else
    size=   "large"
    :title= "$t('asocs.noneAdmind.heading')",
    :CTA=   "$t('asocs.noneAdmind.CTA')",
    :actions= "{ newAsoc: $t('asocs.noneAdmind.action') }"
  )

</template>

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
    margin: (config.spacings.inBoxes/2)

    +above(l)
      margin: config.spacings.inBoxes
</style>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import buton from 'form/button'
import empty from '~components/empty'

import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      asociatieInitializata: false
    }
  },
  components: {
    sction,
    widget,
    buton,
    empty
  },
  computed: mapGetters({
    asociatii: 'asociatie/ids',
    activaId: 'asociatie/activa',
    nrAsociatiiAdministrate: 'asociatie/nrTotal',
    structura: 'asociatie/activaBlocuri'
  }),
  methods: mapActions({
    openModal: 'modal/open',
    stergeAsociatie: 'asociatie/sterge'
  })
}
</script>
