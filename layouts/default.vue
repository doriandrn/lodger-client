<template lang="pug">
#layout
  headr
    .inner
      logo

      //- field.switch(
      //-   v-model=    "idAsociatieActiva",
      //-   id=         "asociatieSwitch"
      //-   label=      "defaults.asociatia"
      //-   type=       "altselect",
      //-   :options=   "switchOptions"
      //-   :arrow=     "true"
      //-   :required=  "true"
      //- )

      nav(
        data-orientation="horizontal"
      )
        ul(v-if=   "administreazaCelPutinOAsociatie")
          li(
            v-for="item, url in $lodger.i18n.nav"
          )
            nuxt-link(:to="url") {{ item }}
        ul(v-else)
          li
            nuxt-link(to="/dashboard") {{ navInitializare }}

      //- nuxt-link(
      //-   v-if=     "balanta"
      //-   to=       "/registru"
      //-   slot=     "right"
      //- )
      //-   bani(
      //-     :valoare= "balanta",
      //-     data-icon="shield"
      //-   )

      .right
        field(
          type=     "search"
          v-model=  "search"
          size=     "small"
          id=       "search"
          :label=        "$lodger.i18n.search"
          :placeholder=  "$lodger.i18n.search"
          hide-label
        )

        buton(
          styl=   "unstyled"
          icon=   "settings"
          slot=   "right"
          to=     "/setari#asociatie"
          icon-only
        ) {{ 'settings.title' }}

  main
    nuxt(:nuxt-child-key="activePage")

  footr
    a user select
    p Utilizator adaugat! bla bla
    div
      field(
        type=       "altselect"
        id=         "displayCurrency"
        :options=   "$Lodger.currencies"
        :value=     "$Lodger.currencies.indexOf($Lodger.displayCurrency)"
        @input=     "$Lodger.displayCurrency = $event"
        hideLabel
      )

      .lang-switch
        a(
          v-for=      "lang in $lodger.supportedLangs"
          v-tooltip=  "lang.nativeName"
          @click=     "$Lodger.locale = lang.code"
        ) {{ lang.code }}
      buton Feedback
      .copyright
        p(v-if="app") {{ app.name }} v{{ app.version }} - Copyright 2020 {{ app.author }}
        a credits

  //- toasts

  modal

      //- frm#main(
      //-   v-if=       "modalContent && modalContent !== 'prompt'",
      //-   :form=      "modalForm",
      //-   :isNew=     "modalContent.split('.')[1] === 'new'"
      //-   @submit=    "$lodger.put(modalContent.split('.')[0], $event)"
      //- )

      //- prompt(v-else-if= "modalContent === 'prompt'")

      //- p(v-else) loading
        //- cale(slot="footer")
</template>

<script>
import { Observer } from 'mobx-vue'

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

import Package from '../package.json'

const { version, name, author } = Package
const subName = 'default'

export default Observer ({
  data () {
    return {
      app: {
        version,
        name,
        author
      },
      activeUserId: '',
      search: '',
      navItems: [
        {
          title: 'dash',
          url: '/dashboard'
        },
        {
          title: 'liste',
          url: '/liste'
        },
        {
          title: 'istoric',
          url: '/istoric'
        }
        // {
        //   title: $t('navigation[2]'),
        //   url: '/community'
        // }
      ]
    }
  },

  // async asyncData ({ $lodger }) {

  // },

  beforeCreate () {
    this.$lodger.utilizatori.subscribe(subName)
  },

  computed: {
    activePage () {
      return this.$route.fullPath
    },
    administreazaCelPutinOAsociatie () {
      return true
    }
  },
  beforeDestroy () {

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
})
</script>

<style lang="stylus">
@require '~styles/config'
footerHeight = 40px

.right
  margin-left auto

#layout
  display flex
  flex-flow column nowrap
  max-height 100vh
  overflow hidden
  position relative

  .actions
    width 100%
    display flex
    flex-flow row wrap
    flex-basis 100%
    justify-content center

    > *
      margin 10px

  > header
    position fixed 0 0 auto 0
    z-index 99
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items center
    background-color: rgba(black, .05);

    .inner
      align-items center
      flex-flow row nowrap

      .right
        display flex
        flex-flow row nowrap

      > div
        max-height 40px

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
      flex-direction column

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
    position absolute
    bottom 0
    left 0
    right 0
    height: footerHeight
    line-height: footerHeight
    z-index 2
    background: config.palette.borders
    display flex
    flex-flow row nowrap

.inner
  max-width: config.sizes.maxContainerWidth
  margin 0 auto
  padding: 0 baseSpacingUnit*3
  position relative
  display flex
  width: 100%;
  justify-content: space-between;

.lang-switch a
  margin 0 8px
</style>
