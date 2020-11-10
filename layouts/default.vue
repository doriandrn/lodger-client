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

      .right(
        v-show= "$lodger.utilizatori.subscribers.prince && $lodger.utilizatori.subscribers.prince.ids.length"
      )
        field(
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
                :value=     "$Lodger.displayCurrency"
              )

              field(
                type=       "select"
                id=         "lang"
                :label=     "$lodger.i18n.forms.preferences.fields.lang"
                :options=   "Object.keys($lodger.supportedLangs).map(k => $lodger.supportedLangs[k].name)"
                :value=     "$Lodger.locale"
                @input=     "$Lodger.locale = $event"
              )

              field(
                type=       "checkbox"
                :label=     "$lodger.i18n.forms.preferences.fields.shortKeys"
              )
              //- .lang-switch
              //-   a(
              //-     v-for=      "lang in $lodger.supportedLangs"
              //-     v-tooltip=  "lang.nativeName"
              //-     @click=     "$Lodger.locale = lang.code"
              //-   ) {{ lang.code }}

        dropdown.u(
          v-if= "$lodger.utilizatori.subscribers.prince.selectedId"
          toggleText= ""
          icon-only
        )
          //- :toggleText= "$lodger.i18n.taxonomies.utilizatori.switch"
          viw(
            v-for=  "t, i in ['avatar', 'name']"
            :type=  "t"
            :key=   "i"
            :value= "$lodger.utilizatori.subscribers.prince.items[$lodger.utilizatori.subscribers.prince.selectedId][t]"
            :avatarSeed=  "$lodger.utilizatori.subscribers.prince.items[$lodger.utilizatori.subscribers.prince.selectedId].name"
            slot=   "beforeText"
          )

          tax(
            :taxonomy=        "$lodger.utilizatori"
            :subscriberName=  "$lodger.mainSubName"
            hideSelectedItem
          )


  main
    nuxt(:nuxt-child-key="activePage")

    .devTools(v-if="env === 'development'")
      p lola

  footr
    nav
      buton(
        icon= "life-buoy"
        styl= "unstyled"
      ) {{ $lodger.i18n.footer.links.help }}
      buton(
        icon= "message-circle"
        styl= "unstyled"
      ) {{ $lodger.i18n.footer.links.feedback }}
      buton(
        icon= "award"
        styl= "unstyled"
      ) {{ $lodger.i18n.footer.links.thanks }}

    .copyright
      p(v-if="app") #[strong {{ app.name }} v{{ app.version }}] - &copy; 2017 - {{ curYear }} {{ app.author }}

  //- toasts

  modal
    p(v-if="$lodger.modal.firstTime") FIRST TIME EVER OMFGs {{  }}

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
import currencies from 'form/presets/selects/currencies'

import toasts from 'c/toasts'
import dropdown from 'c/dropdown'
import results from 'c/searchResults'
import tax from 'c/tax'
import viw from 'c/viewElement'

import Package from '../package.json'

const { version, name, author } = Package
// const subName = 'default'

export default Observer ({
  data () {
    const results = {}
    this.$lodger.taxonomies.map(t => results[t] = [])
    return {
      app: {
        version,
        name,
        author
      },
      search: {
        input: '',
        results,
        fetching: true
      },
    }
  },

  async beforeCreate () {
    const { $lodger: { utilizatori, mainSubName, modal } } = this
    await utilizatori.subscribe(mainSubName, { autoSelectOnCRUD: true })
    const sub = utilizatori.subscribers[mainSubName]
    if (!sub.ids.length) {
      modal.activeDoc = utilizatori.collection.newDocument({})
      modal.closeable = false
      modal.firstTime = true
    }
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
    currencies,
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
footerHeight = 40px

.right
  margin-left auto

.dropdown.u
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

  .actions
    width 100%
    display flex
    flex-flow row wrap
    flex-basis 100%
    justify-content center

    > *
      margin 10px

  > footer
    user-select none

  > header
    position fixed 0 0 auto 0
    z-index 99
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items center
    background-color transparent
    -webkit-app-region: drag

    .edd-root
      width 160px

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

  > footer
    position absolute
    bottom 0
    left 0
    right 0
    line-height: footerHeight
    z-index 2
    display flex
    flex-flow row nowrap

    .inner
      justify-content center
      flex-flow column nowrap
      align-items center

    nav > *
      margin 0 16px


</style>
