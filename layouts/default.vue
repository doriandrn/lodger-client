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
          nuxt-link(to="/dashboard") {{ $t( 'asociatie.init.title' ) }} - {{ $t( 'defaults.asociatia' ) }} {{ activa.name }}

    nuxt-link(
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

    dropdown(
      slot=       "right",
      icon=       "plus",
      :toggleText=   "$t('defaults.add')"
    )
      butonIncaseaza(
        styl= "unstyled"
      )
      buton(
        @click= "debug('cc')"
        styl= "unstyled"
        icon= "contor"
      ) Citire contor
      buton(
        styl=   "unstyled"
        @click= "openModal('cheltuiala.new')"
      ) Cheltuială / Factură
      buton(
        styl=   "unstyled"
        icon=   "asociatie"
        @click= "openModal('asociatie.new')"
      ) Asociație

    dropdown(
      slot=         "right",
      icon=         "settings"
      :toggleText=   "$t('settings')"
    )
      buton(
        styl=   "unstyled"
        to=     "/setari#asociatie"
      ) {{ $t('defaults.asociatie') }}

  main
    nuxt(v-if=  "activa._id")

  footr
    p {{ app.name }} v{{ app.version }} - Copyright 2018 {{ app.author }}
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
        :formData=  "formData(modalContent, this)",
        :formName=  "modalContent"
        :type=      "modalContent.split('.')[1]"
      )

      prompt(v-else-if= "modalContent === 'prompt'")

      p(v-else) loading
      //- cale(slot="footer")
</template>

<script>
import logo from '~components/logo'
import headr from '~components/header'
import footr from '~components/footer'
import modal from '~components/modal'
import frm from '~components/form.vue'
import prompt from '~components/prompt'
import cale from '~components/cale'
import bani from '~components/bani'
import field from 'form/field'
import buton from 'form/button'
import butonIncaseaza from 'cc/butonIncaseaza'
import toasts from '~components/toasts'
import dropdown from '~components/dropdown'

import { mapGetters, mapActions } from 'vuex'
import { version, name, author } from '../package.json'

export default {
  data () {
    const { $t } = this
    return {
      app: {
        version,
        name,
        author
      },
      search: '',
      navItems: [
        {
          title: $t('navigation[0]'),
          url: '/dashboard'
        },
        {
          title: $t('navigation[1]'),
          url: '/liste'
        },
        {
          title: $t('navigation[2]'),
          url: '/community'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      schimbaAsociatieActiva: 'asociatie/schimba',
      modalClose: 'modal/close',
      openModal: 'modal/open'
    }),
    get formData () {
      return (id, ctx) => {
        if (!id || !id.length) return
        const path = id.split('.')
        const data = require(`forms/${path[0]}`)
        let { campuri, actiuni } = data
        if (!campuri) return

        const { modalContent, modalData, blocuri, apartamente, debug } = ctx

        campuri = campuri.filter(camp => !camp.notInAddForm)
        // campuri.forEach(camp => {
        //   if (path[1] === 'edit' && typeof modalData === 'object') {
        //     const iId = path[0] === 'serviciu' ? modalData.denumire : modalData._id
        //     switch (path[0]) {
        //       case 'bloc':
        //         camp.value = blocuri[iId][camp.id]
        //         break

        //       case 'apartament':
        //         camp.value = apartamente[iId][camp.id]
        //         break
        //     }
        //   } 
        //   // else if (path[1] === 'new') camp.value = camp.default || null

        //   // switch (camp.id) {
        //   //   case 'asociatieId':
        //   //     const { activa, idsAsociatii } = ctx
        //   //     Object.assign(camp, {
        //   //       options: idsAsociatii,
        //   //       value: activa,
        //   //       slot: 'footer',
        //   //       size: 'small'
        //   //     })
        //   //     break
        //   // }
        // })
        debug('form data', campuri)
        return { campuri, actiuni, $for: path[0] }
      }
    }
  },
  computed: {
    // idAsociatieActiva () {
    //   return this.activa._id
    // },
    switchOptions () {
      const { idsAsociatii, asociatii } = this
      const selector = {}
      idsAsociatii.map(asoc => {
        selector[asoc] = asociatii[asoc].name
      })
      return selector
    },
    idAsociatieActiva: {
      get () { return this.activa._id },
      set (asocId) {
        this.debug('asoc', asocId)
        if (typeof asocId !== 'string') return
        this.schimbaAsociatieActiva(asocId)
      }
    },
    administreazaCelPutinOAsociatie () {
      const { idsAsociatii } = this
      return idsAsociatii && idsAsociatii.length > 1
    },
    ...mapGetters({
      asociatii: 'asociatii',
      blocuri: 'blocuri',
      idsAsociatii: 'asociatie/ids', 
      activa: 'asociatie/activa',
      balanta: 'asociatie/balanta',
      apartamente: 'apartamente',
      modalOpen: 'modal/open',
      modalContent: 'modal/content',
      modalData: 'modal/data'
    })
  },
  beforeDestroy () {
    this.$store.commit('DESTROYMAIN', 1)
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
    butonIncaseaza,
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
      display flex
      flex-flow column-reverse wrap
      padding-top 8px
      padding-bottom 8px
      padding-right 42px
      height 100%
      margin-left 0

      .altselect
        position absolute 0 0 auto
        padding 0 !important
        max-height 54px
        
        > ul
          border-color transparent

          > li
            padding-left 30px
            text-transform capitalize

            &[data-sel]
              padding-top 20px

            &:before
              background-color #aaa
              position absolute
              left 12px
      
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
