<template lang="pug">
#layout
  headr
    logo
    
    field.switch(
      v-if=       "administreazaCelPutinOAsociatie"
      v-model=    "idAsociatieActiva",
      id=         "asociatieSwitch"
      label=      "defaults.asociatia"
      type=       "altselect",
      :options=   "switchOptions"
      :arrow=     "true"
      :required=  "true"
    )

    nav(
      data-orientation="horizontal"
    )
      ul(v-if=   "administreazaCelPutinOAsociatie")
        li(
          v-for="item in navItems"
        )
          nuxt-link(:to="item.url") {{ item.title }}
      ul(v-else)
        li
          nuxt-link(to="/dashboard") {{ navInitializare }}

    nuxt-link(
      v-if=     "balanta"
      to=       "/registru"
      slot=     "right"
    )
      bani(
        :valoare= "balanta",
        data-icon="shield"
      )

    field(
      slot=     "right"
      type=     "search"
      v-model=  "search"
      size=     "small"
      id=       "search"
      :label=  "$t('defaults.search')"
      :placeholder=  "$t('defaults.search')"
      hide-label
    )

    buton(
      styl=   "unstyled"
      icon=   "settings"
      slot=   "right"
      to=     "/setari#asociatie"
      icon-only
    ) {{ $t('settings.title') }}

  main
    nuxt

  footr
    p(v-if="app") {{ app.name }} v{{ app.version }} - Copyright 2018 {{ app.author }}
    ul.footer__stuff(slot="right")
      li
        nuxt-link(to="/credits") Credits
      li
        buton Feedback

  toasts
  modal(
      v-show=  "modalOpen"
      :title=   "modalContent && modalContent !== 'prompt' ? $t(`${modalContent}.title`) : null"
    )
      frm#main(
        v-if=       "modalContent && modalContent !== 'prompt'",
        :form=      "modalForm",
        :isNew=     "modalContent.split('.')[1] === 'new'"
      )

      prompt(v-else-if= "modalContent === 'prompt'")

      p(v-else) loading
      //- cale(slot="footer")
</template>

<script>
import logo from 'c/logo'
import headr from 'c/header'
import footr from 'c/footer'
import modal from 'c/modal'
import frm from 'c/form.vue'
import prompt from 'c/prompt'
import cale from 'c/cale'
import bani from 'c/bani'
import field from 'form/field'
import buton from 'form/button'

import toasts from 'c/toasts'
import dropdown from 'c/dropdown'

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
      search: '',
      navItems: [
        {
          title: this.$t('navigation[0]'),
          url: '/dashboard'
        },
        {
          title: this.$t('navigation[1]'),
          url: '/liste'
        },
        // {
        //   title: $t('navigation[2]'),
        //   url: '/community'
        // }
      ]
    }
  },
  methods: {
    ...mapActions({
      schimbaAsociatieActiva: 'asociatie/schimba',
      modalClose: 'modal/close',
      openModal: 'modal/open'
    }),
    // get formData () {
    //   return (id, ctx) => {
    //     if (!id || !id.length) return
    //     const path = id.split('.')
    //     const data = require(`forms/${path[0]}`)
    //     let { campuri, actiuni } = data
    //     if (!campuri) return

    //     const { modalContent, modalData, blocuri, apartamente, debug } = ctx

    //     campuri = campuri.filter(camp => !camp.notInAddForm)
    //     debug(`${path[0]} Form data: `, campuri)
    //     return { campuri, actiuni, $for: path[0] }
    //   }
    // }
  },
  computed: {
    modalForm () {
      const name = this.modalContent.split('.')[0]
      return this.$lodger.forms.filter(form => form.name === name)[0]
    },
    switchOptions () {
      const { idsAsociatii, asociatii } = this
      const selector = {}
      idsAsociatii.map(asoc => {
        selector[asoc] = asociatii[asoc].name
      })
      return selector
    },
    navInitializare () {
      // const { $t, $activa } = this
      // if (!$activa || !$activa.name) return $t('navigation[0]')
      // return `${ $t( 'asociatie.init.title' ) } - ${ $t( 'defaults.asociatia' ) } ${ $activa.name }`
      return ''
    },
    $activa () {
      if (!this.$lodger) return {}
      const activaId = this.$store.getters['asociatie/active']
      if (!activaId) return {}
      return this.$lodger.db.asociatii.findOne(activaId).exec()
    },
    balanta () {
      return this.$activa.balanta
    },
    // idAsociatieActiva: {
    //   get () { return this.$activa._id },
    //   set (asocId) {
    //     this.debug('asoc', asocId)
    //     if (typeof asocId !== 'string') return
    //     this.schimbaAsociatieActiva(asocId)
    //   }
    // },
    administreazaCelPutinOAsociatie () {
      const { idsAsociatii } = this
      return idsAsociatii && idsAsociatii.length > 1
    },
    idsAsociatii () {
      return []
    },
    ...mapGetters({
      asociatii: 'asociatii',
      blocuri: 'blocuri',
      // idsAsociatii: 'asociatie/ids', 
      activa: 'asociatie/active',
      apartamente: 'apartamente',
      modalOpen: 'modal/open',
      modalContent: 'modal/content',
      modalData: 'modal/data'
    })
  },
  beforeDestroy () {
    // this.$store.commit('DESTROYMAIN', 1)
  },
  components: {
    headr,
    logo,
    modal,
    buton,
    footr,
    cale,
    frm,
    prompt,
    field,
    bani,
    toasts,
    dropdown
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
footerHeight = 24px

#layout
  display flex
  flex-flow column nowrap
  min-height 100vh

  .actions
    width 100%

    &:not(.split)
      display flex
      flex-flow row wrap
      flex-basis 100%

  > header
    position fixed 0 0 auto 0
    z-index 99

    nav
      position fixed
      display none
      margin-left 0

      +above(xl)
        position relative
        display block

      ul
        padding 0
        list-style-type none
        display flex
        flex-flow row wrap

    &+main
      padding-top 48px

    .switch
      position relative
      padding-left 0
      margin-left 0
      height 100%
      max-width 250px

      .altselect    
        max-height 48px    
        > ul
          border-color transparent

          > li
            &:before
              background-color #aaa
              position absolute
              left 12px

            > span
              display block
              position relative
              font-size 13px
              line-height 16px
              white-space nowrap
      
      label
        font-size 9px
        text-transform uppercase
        font-weight 100
        line-height 12px
        letter-spacing 1px
        white-space nowrap
        position relative
        pointer-events none
        color: config.typography.palette.meta
        z-index 21

        position absolute
        top 4px
        left 24px

      select
        position absolute 0
        width 100%
        box-shadow none
        margin 0
        text-transform capitalize
        padding 4px 8px
        text-indent 8px
        max-width 100%
        font-weight 500
        appearance none

  > main
    fullflex()
    // margin-bottom: footerHeight
    background: config.palette.bgs.body
    min-height 100vh
    position relative
    z-index 1

    > section
      fullflex()
      > .inner
        fullflex(1)
  
  > footer
    position fixed
    bottom 0
    left 0
    right 0
    height: footerHeight
    line-height: footerHeight
    z-index -1
    background: config.palette.borders

.inner
  max-width: config.sizes.maxContainerWidth
  margin 0 auto
  padding: 0 baseSpacingUnit*3
  position relative

</style>
