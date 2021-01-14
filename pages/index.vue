<template lang="pug">
sction#idx(
  boxes
)
  list(
    v-show=           "$l.activeUserId"
    v-for=            "tax in $l.taxonomies.filter(t => t !== 'utilizatori')"
    v-if=             "!$l[tax].parents || $l[tax].parents && $l[tax].form.schema.required.filter(p => $l[tax].parents.indexOf(taxAsPlural(p)) > -1)"
    :key=             "tax"
    :taxonomy=        "$l[tax]"
    :subscriberName=  "subscriberName"
    :extra-fields=    "['state']"
  )

  section.welcome(v-if="!$l.activeUserId && !$l.utilizatori.subscribers[$l.mainSubName].ids.length")
    h1 {{ $l.i18n.welcome.title }}
    p.intro {{ $l.i18n.welcome.intro }}

    field.lang(
      type=       "select"
      id=         "lang-intro"
      :label=     "$l.i18n.forms.preferences.fields.lang"
      :options=   "$l.supportedLangs"
      v-model=    "$l.locale"
      data-styl=       "unstyled"
    )

    .actions(v-if="!$l.modal.activeDoc")
      buton(size="large" icon="database" :shortkeys="['i']" @click="debug('import')") {{ $l.i18n.welcome.actions.import }}
      buton(primary size="large" arrow="right" @click="newUser" :shortkeys="['enter']") {{ $l.i18n.welcome.actions.newUser }}

  section.users(v-if="!$l.activeUserId && $l.utilizatori.subscribers[$l.mainSubName].ids.length")
    p user select
    list(
      :taxonomy=        "$l.utilizatori"
      :subscriberName=  "subscriberName"
      :extra-fields=    "['state']"
    )

</template>

<script>
import sction from 'c/section'
import frm from 'c/form'
import list from 'c/tax'
import registru from 'c/registru'
import servicii from 'c/servicii'
import modal from 'c/modal'
import viw from 'c/viewElement'

import field from 'form/field'
import buton from 'form/button'

import { Observer } from 'mobx-vue'
import { reaction } from 'mobx'

export default Observer({
   head () {
    return {
      link: [
        {
          rel: "stylesheet",
          href: `/${ this.$l.teme[this.tema] }.css`
        }
      ]
    };
  },

  data () {
    return {
      tema: this.$l.state.appPreferences.display.tema
    }
  },

  created () {
    const { display } = this.$l.state.appPreferences
    display.tema = display.tema || 0
    reaction(() => display.tema, (t) => {
      this.tema = t
    })
  },

  computed: {
    subscriberName () {
      return this.$l.mainSubName
    },
    taxAsPlural () {
      return p => p.indexOf('Id') === p.length - 2 ? p.replace('Id').plural : p
    }
  },
  methods: {
    newUser () {
      const { $l: { utilizatori, mainSubName, modal } } = this
      const sub = utilizatori.subscribers[mainSubName]
      if (sub.ids.length)
        return

      modal.activeDoc = utilizatori.collection.newDocument({})
      // modal.closeable = false
      modal.firstTime = true

      return true
    }
  },
  components: {
    sction,
    field,
    list,
    buton,
    viw
  },
})
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette
typeColors = config.typography.palette

.welcome
  size 100%

  label
    margin-bottom 0

  p.intro
    text-align center

  .actions
    margin-top 48px

  .lang
    display inline-flex
    flex-flow row-reverse nowrap
    justify-content center
    align-items center
    position relative
    min-width 140px
    width auto
    margin 0 auto

    label
      font-size 0
      position absolute
      left 10px
      top calc(50% - 6px)

      &:before
        margin 0

    .head
      padding-left 16px

    .root
    .head
      // width 100%
      display inline-flex

    .root
      width 100%

    .body
      min-width 240px

h3
  small
    span
      display inline-block
      vertical-align baseline
      position relative
      z-index 3
      // border 1px solid rgba(black, .125)
      background: white
      size 20px
      line-height 20px
      border-radius 50px
      font-size 11px
      margin-left 8px
      color: typeColors.ui
      text-align center

      &+span
        z-index 2
        margin-left 0
        size 24px
        line-height 24px
        border 0
        left -6px
        text-align right
        padding-right 6px
        background: rgba(black, .075)

#idx
  .inner
    > div
      display flex
      flex-flow row wrap

  *
    user-select none

  aside
    margin-top 30px

    +above(xl)
      margin-top 0
      margin-left 48px

  .view
    flex 1 1 100%
    display flex
    flex-flow row nowrap

    > li
      width auto !important
      flex 0 0 auto

      &:first-child
        margin-left auto

  &.boxes
    .inner > div > *
      margin 8px

      // +above(l)
      //   margin 16px

      // +above(xl)
      //   margin 20px

      // +desktop()
      //   margin 24px

    [data-tax]
      display flex
      flex-flow column nowrap
      padding 8px
      // border 1px solid rgba(black, .05)
      order 10
      flex 1 1 100%

      +above(l)
        flex-basis 266px

      +above(xl)
        flex-basis 300px

    [data-tax="utilizatori"]
      order 0

    [data-tax="asociatii"]
      order 1

    [data-tax="blocuri"]
      order 2

    [data-tax="apartamente"]
      order 3

  h3
    margin-bottom 0
    white-space nowrap
    flex 1 1 auto
    text-align left

  > button
    margin auto auto 0

  &es
    display flex
    flex-flow row wrap
    margin -8px

  &.prefs
    margin-left auto
    min-width 200px

</style>
