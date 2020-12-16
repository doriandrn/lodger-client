<template lang="pug">
#layout
  headr
    .inner
      crumbs
      //- nav(data-orientation="horizontal")
      //-   ul(v-if=   "administreazaCelPutinOAsociatie")
      //-     li(
      //-       v-for="item, url in $lodger.i18n.nav"
      //-     )
      //-       nuxt-link(:to="url") {{ item }}

      //-   ul(v-else)
      //-     li
      //-       nuxt-link(to="/dashboard") {{ navInitializare }}

      .right
        field(
          v-if=     "$lodger.activeUserId"
          type=     "search"
          size=     "small"
          id=       "search"
          :label=        "$lodger.i18n.search.do"
          :placeholder=  "$lodger.i18n.search.do"
          @input=   "Search($event)"
          :value=   "search.input"
          :focusShortkeys= "['ctrl', 'k']"
          hide-label
        )
          results(
            :class=     "{ v: search.input }"
            :fetching=  "search.fetching"
            :results=   "search.results"
          )

        dropdown(
          v-if= "$lodger.activeUserId"
          icon=   "settings"
          :arrow= "false"
          :toggleText=  "$lodger.i18n.forms.preferences.title"
          :toggleKeys=  "['ctrl', '/']"
          iconOnly
        )
          form.form
            fieldset
              legend {{ $lodger.i18n.forms.preferences.fieldsets[0] }}

              currencies(
                id=         "displayCurrency"
                :value=     "Number($lodger.displayCurrency)"
                @input=     "$lodger.displayCurrency = Number($event)"
                :data-sym=  "$lodger.displayCurrency"
              )

              field(
                type=       "select"
                id=         "lang"
                :label=     "$lodger.i18n.forms.preferences.fields.lang"
                :options=   "$lodger.supportedLangs"
                v-model=    "$lodger.locale"
              )

              field(
                type=       "select"
                id=         "tema"
                :options =  "$lodger.teme"
                v-model=    "$lodger.state.appPreferences.display.tema"
              )

              field(
                id=         "hokeys"
                type=       "checkbox"
                v-model=    "$lodger.state.appPreferences.display.hotkeys"
                :label=     "$lodger.i18n.forms.preferences.fields.shortKeys"
              )


        dropdown.u(
          v-if= "$lodger.activeUserId"
          toggleText= ""
          icon-only
        )
          viw(
            v-for=        "t, i in ['avatar', 'name']"
            :type=        "t"
            :key=         "i"
            :value=       "$lodger.utilizatori.subscribers[$lodger.mainSubName].items[$lodger.activeUserId][t]"
            :avatarSeed=  "$lodger.utilizatori.subscribers[$lodger.mainSubName].items[$lodger.activeUserId].name"
            slot=          "beforeText"
          )
          ul
            li
              a Profilul meu

            li
              a(@click= "$lodger.utilizatori.subscribers[$lodger.mainSubName].select($lodger.activeUserId)") Logout

            li
              a Comuta utilizator:
              //- :toggleText= "$lodger.i18n.taxonomies.utilizatori.switch"


              tax(
                :taxonomy=        "$lodger.utilizatori"
                :subscriberName=  "$lodger.mainSubName"
                hideSelectedItem
              )


  main
    nuxt(:nuxt-child-key="activePage")
    dev-tools(v-if="env === 'development'" style="display:none")

  footr
    logo(:tooltip=  "`${ app.name } v${ app.version }<br/>api v${ app.lodgerApiV }<br/><br/> &copy; 2017 - ${ curYear } ${ app.author }`")
    span.update(v-if="$lodger.state.hasUpdate") {{ $lodger.i18n.updates.available }}
      a.go {{ $lodger.i18n.updates.action }}

    span(v-if= "$lodger.activeUserId") {{ $lodger.i18n.updates.currencyRates }}
      date-time(:date-time-i-s-o= "$lodger.state.rates.timestamp" live-update ago)
      button(icon="" @click="$lodger.updateRates()" data-styl="unstyled") {{ $lodger.i18n.update }}

    nav(v-if= "$lodger.activeUserId")
      buton(
        v-for=  "v, k in extraLinks"
        :key=   "k"
        :icon=  "v"
        styl= "unstyled"
        icon-only
      ) {{ $lodger.i18n.footer.links[k] }}

    //- .copyright
    //-   p(v-if="app") #[strong {{ app.name }} v{{ app.version }}] - &copy; 2017 - {{ curYear }} {{ app.author }}

  //- toasts

  modal
    h2(v-if="$lodger.modal.activeDoc && $lodger.modal.firstTime && $lodger.modal.activeDoc.collection") {{ $lodger.i18n.taxonomies[$lodger.modal.activeDoc.collection.name.plural].new.title || 'hilol' }}
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
import dateTime from 'c/dateTime'
import crumbs from 'c/crumbs'
import field from 'form/field'
import buton from 'form/button'
import currencies from 'form/presets/selects/currencies'

import toasts from 'c/toasts'
import dropdown from 'c/dropdown'
import results from 'c/searchResults'
import tax from 'c/tax'
import viw from 'c/viewElement'
import devTools from 'c/dev/toolsWindow'

import Package from '../package.json'

const { version, name, author, dependencies: { lodger } } = Package
// const subName = 'default'

export default Observer ({
  data () {
    const results = {}
    this.$lodger.taxonomies.map(t => results[t] = [])
    return {
      tema: 'a',
      app: {
        version,
        name: name.replace('lodger-', ''),
        author,
        lodgerApiV: lodger.replace('^', '')
      },
      search: {
        input: '',
        results,
        fetching: true
      },
      extraLinks: {
        help: 'life-buoy',
        feedback: 'message-circle',
        thanks: 'award'
      }
    }
  },

  async beforeCreate () {
    const { $lodger: { utilizatori, mainSubName, modal } } = this
    await utilizatori.subscribe(mainSubName, { autoSelectOnCRUD: true })
    const sub = utilizatori.subscribers[mainSubName]
    // await sub.updates
  },

  methods: {
    Search (input) {
      this.debug('searching', input)
      this.search.input = input
      this.search.fetching = true
      this.$lodger.taxonomies.map(tax => {
        Promise.resolve(this.$lodger[tax].collection.search(input)).then(results => {
          this.search.results[tax] = results
          this.search.fetching = false
        })
      })
    }
  },

  computed: {
    activePage () {
      return this.$route.fullPath
    },
    administreazaCelPutinOAsociatie () {
      return true
    },
    curYear () {
      const d = new Date()
      return d.getFullYear()
    },
    env () {
      return process.env.NODE_ENV
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
    crumbs,
    currencies,
    dateTime,
    devTools,
    frm,
    prompt,
    field,
    bani,
    toasts,
    dropdown,
    results,
    tax,
    viw
  }
})
</script>

<style lang="stylus">
@require '~styles/config'
footerHeight = 36px

.right
  margin-left auto

.dropdown.u
  main
    padding 0 !important

    > div
      width 100%

  li
    padding 4px 8px

  > button
    padding-left 0

  .avatar
    margin-right 8px

    img
      size 40px

.inner
  max-width: config.sizes.maxContainerWidth
  margin 0 auto
  padding: 0 baseSpacingUnit*3
  position relative
  display flex
  width: 100%;
  justify-content: space-between;

#layout
  display flex
  flex-flow column nowrap
  max-height 100vh
  overflow hidden
  position relative

  .crumbs
    position fixed
    left 0
    top 0
    width auto

  .actions
    width 100%
    display flex
    flex-flow row wrap
    flex-basis 100%
    justify-content center

    > *
      margin 10px

      +above(l)
        margin 16px

      +above(xl)
        margin 20px

  > footer
    user-select none
    position absolute
    bottom 0
    left 0
    right 0
    line-height: footerHeight
    z-index 2
    display flex
    flex-flow row nowrap
    background darken(config.palette.bgs.body, 3%)
    overflow hidden

    button[data-icon]
      font-size 0

    .logo
      font-size 0
      flex 0 1 auto
      opacity .5
      transition opacity 1s ease-in-out

      &:hover
        opacity 1

      &:first-child:last-child
        margin 0 auto

    p
    h3
      margin-bottom 0

    p
      font-size 10px
      color rgba(black, .25)

    .inner
      flex-flow row nowrap
      align-items center
      justify-content space-between

      > span
        display flex
        flex-flow row nowrap
        margin 0 6px
        color #aaa

        > *
          margin-left 4px

    nav
      margin-left auto

      > *
        margin 0 4px

  > header
    position fixed 0 0 auto 0
    z-index 99
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items center
    background-color transparent
    -webkit-app-region: drag

    .dropdown
      form
        .root
          width 160px
          margin-left auto

    .inner
      align-items center
      flex-flow row nowrap

      .right
        display flex
        flex-flow row nowrap

        > *
          &:not(:first-child)
            margin-left 12px

      > div
        max-height 40px

    nav
      position fixed
      display none
      margin-left 0
      top 60px

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

    // .switch
    //   position relative
    //   padding-left 0
    //   margin-left 0
    //   height 100%
    //   max-width 250px

    //   .altselect
    //     max-height 48px
    //     > ul
    //       border-color transparent

    //       > li
    //         &:before
    //           background-color #aaa
    //           position absolute
    //           left 12px

    //         > span
    //           display block
    //           position relative
    //           font-size 13px
    //           line-height 16px
    //           white-space nowrap

    //   label
    //     font-size 9px
    //     text-transform uppercase
    //     font-weight 100
    //     line-height 12px
    //     letter-spacing 1px
    //     white-space nowrap
    //     position relative
    //     pointer-events none
    //     color: config.typography.palette.meta
    //     z-index 21

    //     position absolute
    //     top 4px
    //     left 24px

    //   select
    //     position absolute 0
    //     width 100%
    //     box-shadow none
    //     margin 0
    //     text-transform capitalize
    //     padding 4px 8px
    //     text-indent 8px
    //     max-width 100%
    //     font-weight 500
    //     appearance none

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


</style>
