<template lang="pug">
#layout(:class="{modalOpen}")
  headr
    h3.logo
      nuxt-link(to="/") Lodger
    
    slect(
      v-if=     "idsAsociatii.length"
      v-model=  "idAsociatieActiva",
      :options= "optiuniSwitcherAsociatie"
    )

    nav(
      data-orientation="horizontal"
    )
      li(
        v-for="item in navItems"
      )
        nuxt-link(:to="item.url") {{ item.title }}
  main
    nuxt
    modal(
      v-if= "modalOpen"
      :title= "modalContent !== 'prompt' ? $t(`${modalContent}.title`) : null"
    )
      frm(
        v-if=       "modalContent !== 'prompt'",
        @submit=    "formulare[modalContent].actiuni.confirm"
        :_fields=   "formulare[modalContent].campuri"
      )
      prompt(v-else)

  footr
    p {{ app.name }} v{{ app.version }} - Copyright 2018 {{ app.author }}
</template>

<style lang="stylus">
@require '~styles/config'

fullflex()
  display flex
  flex 1 1 100%
  width 100%
  flex-flow column nowrap

#layout
  display flex
  flex-flow column nowrap
  min-height 100vh

  > header
    position fixed 0 0 auto 0
    z-index 99

    &+main
      padding-top 48px

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
      ],
      formulare: {
        'asocs.new': {
          actiuni: {
            confirm: this.adaugaAsociatie
          },
          campuri: [
            {
              id: 'name',
              type: 'text',
              label: this.$t('asocs.new.name'),
              required: true,
              focus: true
            },
            {
              id: 'idN',
              type: 'text',
              label: this.$t('asocs.new.idN')
            }
          ]
        }
      }
    }
  },
  methods: {
    ...mapActions({
      adaugaAsociatie: 'asociatie/adauga',
      schimbaAsociatieActiva: 'asociatie/schimba',
      modalClose: 'modal/close'
    })
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
      modalOpen: 'modal/open',
      modalContent: 'modal/content'
    })
  },
  components: {
    headr,
    modal,
    footr,
    frm,
    prompt,
    slect
  }
}
</script>
