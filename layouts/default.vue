<template lang="pug">
#layout
  headr
    logo
    
    field.switch(
      v-if=     "idsAsociatii && idsAsociatii.length > 1"
      v-model=  "idAsociatieActiva",
      id=       "asociatieSwitch"
      label=    "Asociația de locatari"
      type=     "altselect",
      :options= "idsAsociatii"
      :arrow=   "true"
    )

    nav(
      data-orientation="horizontal"
    )
      li(
        v-for="item in navItems"
      )
        nuxt-link(:to="item.url") {{ item.title }}

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
      size=     "small"
      id=       "search"
      :placeholder=  "$t('search')"
      hide-label
    )
  
  main
    nuxt
    modal(
      v-show=  "modalOpen"
      :title=   "modalContent && modalContent !== 'prompt' ? $t(`${modalContent}.title`) : null"
    )
      frm#main(
        v-if=       "modalContent && modalContent !== 'prompt'",
        :formData=  "formData(modalContent, this)",
        :type=      "modalContent.split('.')[1]"
      )

      prompt(v-else-if= "modalContent === 'prompt'")

      p(v-else) loading
      //- cale(slot="footer")

  footr
    p {{ app.name }} v{{ app.version }} - Copyright 2018 {{ app.author }}
    ul.footer__stuff(slot="right")
      li
        nuxt-link(to="/credits") Credits
      li
        buton Feedback

  toasts
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
import toasts from '~components/toasts'

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
        if (!id || !id.length) return
        const path = id.split('.')
        const data = require(`forms/${path[0]}`)
        let { campuri, actiuni } = data
        if (!campuri) return

        const { modalContent, modalData, $t, blocuri, apartamente, debug } = ctx

        campuri = campuri.filter(camp => !camp.notInAddForm)
        campuri.forEach(camp => {
          console.log('B', camp)
          if (path[1] === 'edit' && typeof modalData === 'object') {
            const iId = path[0] === 'serviciu' ? modalData.denumire : modalData._id
            switch (path[0]) {
              case 'bloc':
                camp.value = blocuri[iId][camp.id]
                break

              case 'apartament':
                camp.value = apartamente[iId][camp.id]
                break
            }
          } 
          else if (path[1] === 'new') camp.value = camp.default || null
          console.log('C', camp)

          // if (camp.label.indexOf(path[0]) < 0) camp.label = `${path[0]}.${camp.label}`

          switch (camp.id) {
            case 'asociatieId':
              const { activa, idsAsociatii } = ctx
              Object.assign(camp, {
                options: idsAsociatii,
                value: activa,
                slot: 'footer',
                size: 'small'
              })
              break
          }
        })
        debug('form data', campuri)
        return { campuri, actiuni, $for: path[0] }
      }
    }
  },
  computed: {
    idAsociatieActiva: {
      get () { return this.idsAsociatii.indexOf(this.activa) },
      set (name) { this.debug('asoc', name); this.schimbaAsociatieActiva(this.asociatii[name]) }
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
    toasts
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
        display flex
        flex-flow row wrap

    &+main
      padding-top 48px

    .switch
      position relative
      display flex
      flex-flow column wrap
      padding-top 8px
      padding-bottom 8px
      padding-right 42px
      height 100%
      margin-left 0
      // background: config.palette.bgs.body

      .altselect
        position absolute 0 0 auto
        padding 0
        cursor pointer
        background transparent
        transition all .15s ease-in-out

        &:after
          background: config.typography.palette.meta
          right 20px
          top 12px

        &:hover
          background white

        > li
          padding-left 32px
          text-transform capitalize
          background transparent

          &:first-child
            padding-top 20px
      
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
        z-index 1

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
        fullflex()
        justify-content center
  
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
