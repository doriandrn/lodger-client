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

      widget(
        :title=  "$t('asocs.init.title')",
        expand
      )
        div(v-if="defineste")
          frm(title="Adaugă bloc")

        div(slot="sidebar", v-if="defineste || idsBlocuri.length")
          h6 Previzualizare
          ul
            li(v-for="idBloc in idsBlocuri") {{ blocuri[idBloc].nume }}
            li #[buton(@click="openModal('blocs.new')") bloc nou]

        empty(
          v-else-if=  "!defineste && !idsBlocuri.length",
          :title=   "$t('blocs.none.heading')",
          :CTA=     "$t('blocs.none.CTA')",
          :actions= "{ definesteStructura: $t('blocs.none.actions[0]'), importaDate: $t('blocs.none.actions[1]') }"
        )

      widget(
        title=  "$t('asocs.adminZone.title')"
        icon=   "settings"
      )
        ul.actions
          li caca
        .danger
          h4 {{ $t('asocs.adminZone.dangerZone') }}
          buton(
            dangerous,
            icon=     "trash"
            @click=   "stergeAsociatie(activaId)",
            :prompt=  "{ type: 'warning', message: $t('asocs.adminZone.deletePrompt') }"
          ) {{ $t('asocs.adminZone.delete') }}
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
import frm from '~components/form.vue'
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
    empty,
    frm
  },
  computed: mapGetters({
    asociatii: 'asociatie/ids',
    activaId: 'asociatie/activa',
    nrAsociatiiAdministrate: 'asociatie/nrTotal',
    idsBlocuri: 'asociatie/activaBlocuri',
    blocuri: 'bloc/lista',
    defineste: 'asociatie/defineste'
  }),
  methods: mapActions({
    openModal: 'modal/open',
    stergeAsociatie: 'asociatie/sterge'
  })
}
</script>
