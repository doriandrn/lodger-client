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

        div(v-else-if="defineste || idsBlocuri.length")
          h6 Previzualizare
          ul.blocuri
            li(v-for="idBloc in idsBlocuri")
              split
                label.nume {{ blocuri[idBloc].nume || 'Noname'}}
                buton(
                  slot=   "right"
                  @click= "openModal({ id: 'blocs.edit', data: { idBloc }})"
                ) modifica
                buton(
                  slot=     "right"
                  icon=     "trash"
                  dangerous
                ) sterge
              .bloc
                ul.scari
                  li(v-for="scara in blocuri[idBloc].scari")
                    label.nume Scara {{ scara.id }}
                    .scara
                      ul.etaje
                        li(v-for="i in Number(scara.etaje || 0)")
                          p.etaj__nr etaj {{ i }}
                          buton ad ap

            li
              span.nume nou
              buton(@click="openModal('blocs.new')") bloc nou

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

ul.blocuri
  fullflex()
  flex-flow row nowrap
  list-style-type none
  padding 0
  margin -8px

  ul
    list-style-type none
    padding 0

  > li
    margin 8px
    flex 1 0 180px
    display flex
    flex-flow column nowrap

    > .split > .left > label
      text-transform uppercase
      font-weight 700

  .nume
    margin-bottom 8px

  .bloc
    flex 1 1 100%
    margin-top auto
    
    > .scari
      display flex
      flex-flow row nowrap
      margin -4px

      > li
        // flex 1 0 160px
        min-width 160px
        flex-flow column nowrap
        align-items flex-start
        justify-content flex-start
        margin 4px

    .scara
      width 100%

  .etaj
    margin-bottom auto
    padding-bottom 16px

    &e
      background white

    &__nr
      flex 0 0 20px
      border-bottom: 1px solid config.palette.borders
      padding 0 4px
      line-height 20px
      
</style>

<script>
import sction from '~components/section'
import widget from '~components/widget'
import buton from 'form/button'
import frm from '~components/form.vue'
import empty from '~components/empty'
import split from '~components/split'

import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      asociatieInitializata: false
    }
  },
  components: {
    sction,
    split,
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
