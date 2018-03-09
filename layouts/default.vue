<template lang="pug">
#layout(:class="{modalOpen}")
  headr
    h3.logo
      nuxt-link(to="/") Lodger
    
    slect(
      v-if=     "idsAsociatii.length"
      id=       "asociatieSwitch"
      v-model=  "idAsociatieActiva",
      :options= "optiuniSwitcherAsociatie"
      label=    "Asociația de locatari"
    )

    nav(
      data-orientation="horizontal"
    )
      li(
        v-for="item in navItems"
      )
        nuxt-link(:to="item.url") {{ item.title }}

    p(slot="right") ceva
  
  main
    nuxt
    modal(
      v-if= "modalOpen"
      :title= "modalContent !== 'prompt' ? $t(`${modalContent}.title`) : null"
    )
      frm#main(
        v-if=       "modalContent !== 'prompt'",
        :formData=  "formData(modalContent, this)",
        :type=      "modalContent.split('.')[1]"
      )

      prompt(v-else)
      //- cale(slot="footer")

  footr
    p {{ app.name }} v{{ app.version }} - Copyright 2018 {{ app.author }}
</template>

<style lang="stylus">
@require '~styles/config'

#layout
  display flex
  flex-flow column nowrap
  min-height 100vh

  .actions
    width 100%
    display flex
    flex-basis 100%

  > header
    position fixed 0 0 auto 0
    z-index 99

    &+main
      padding-top 48px

    .select
      position relative
      display flex
      flex-flow column wrap
      padding-top 8px
      padding-bottom 8px
      
      label
        font-size 9px
        text-transform uppercase
        font-weight 100
        line-height 12px
        letter-spacing 1px
        white-space nowrap

      select
        padding 0
        box-shadow none
        margin-top 4px
        text-transform capitalize
        font-weight 500

  > main
    fullflex()
    margin-bottom 24px

    > section
      fullflex()
      > .inner
        fullflex()
        > div
          fullflex()

.inner
  max-width: config.sizes.maxContainerWidth
  margin 0 auto
  padding: 0 baseSpacingUnit*3
</style>

<script>
import headr from '~components/header'
import footr from '~components/footer'
import modal from '~components/modal'
import frm from '~components/form.vue'
import prompt from '~components/prompt'
import cale from '~components/cale'
import slect from 'form/select'

import { mapGetters, mapActions } from 'vuex'
import { version, name, author } from '../package.json'

export default {
  data () {
    return {
      app: {
        version,
        name,
        author
      },
      navItems: [
        {
          title: this.$t('navigation[0]'),
          url: '/dashboard'
        },
        {
          title: this.$t('navigation[1]'),
          url: '/liste'
        },
        {
          title: this.$t('navigation[2]'),
          url: '/community'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      schimbaAsociatieActiva: 'asociatie/schimba',
      modalClose: 'modal/close'
    }),
    get formData () {
      return (id, ctx) => {
        const path = id.split('.')
        const data = require(`forms/${path[0]}`)
        const { campuri, actiuni } = data
        const { modalContent, modalData, $t, blocData } = ctx
        // translate
        campuri.forEach(camp => {
          camp.label = $t(camp.label)
          if (path[1] === 'edit' && typeof modalData === 'object' && modalData.id) {
            if (path[0] === 'blocs') {
              camp.value = blocData(modalData.id)[camp.id]
              console.log('vall', camp.value)
            }
          } else {
            camp.value = camp.default || null
          }

          switch (camp.id) {
            case 'asociatieId':
              const { asociatieActiva, optiuniSwitcherAsociatie } = ctx
              camp.options = optiuniSwitcherAsociatie
              camp.value = asociatieActiva
              camp.slot = 'footer'
              break
          }
        })
        console.log('form data', campuri)
        return { campuri, actiuni }
      }
    }
  },
  computed: {
    optiuniSwitcherAsociatie () {
      const opts = {}
      const { idsAsociatii } = this
      if (!idsAsociatii.length) return opts
      idsAsociatii.forEach(id => {
        opts[id] = this.asociatii[id].name
      })
      opts.new = this.$t('asocs.new.title')
      return opts
    },
    idAsociatieActiva: {
      get () { return this.asociatieActiva },
      set (id) { this.schimbaAsociatieActiva(id) }
    },
    ...mapGetters({
      asociatii: 'asociatie/lista',
      idsAsociatii: 'asociatie/ids', 
      asociatieActiva: 'asociatie/activa',
      blocData: 'bloc/data',
      modalOpen: 'modal/open',
      modalContent: 'modal/content',
      modalData: 'modal/data'
    })
  },
  components: {
    headr,
    modal,
    footr,
    cale,
    frm,
    prompt,
    slect
  }
}
</script>
