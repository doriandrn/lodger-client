<template lang="pug">
sction#idx(
  boxes
)
  list(
    v-show=           "$lodger.activeUserId"
    v-for=            "tax in $lodger.taxonomies.filter(t => t !== 'utilizatori')"
    v-if=             "!$lodger[tax].parents || $lodger[tax].parents && $lodger[tax].form.schema.required.filter(p => $lodger[tax].parents.indexOf(taxAsPlural(p)) > -1)"
    :key=             "tax"
    :taxonomy=        "$lodger[tax]"
    :subscriberName=  "subscriberName"
    :extra-fields=    "['state']"
  )
    //- header(slot-scope=  "{ taxonomy, subscriber }")
    //-   h3 {{ $lodger.i18n.taxonomies[taxonomy.plural] ? $lodger.i18n.taxonomies[taxonomy.plural].plural : taxonomy.plural }}
    //-     small(v-if="taxonomy.totals") #[span(v-if="subscriber.ids.length !== taxonomy.totals") {{ subscriber.ids.length }} /] {{ taxonomy.totals }}

    //-   //- field.sort(
    //-   //-   v-if=           "subscriber && subscriber.criteria && subscriber.criteria.sort && taxonomy.form.schema.indexes.length && subscriber.ids.length > 1"
    //-   //-   type=           "select"
    //-   //-   :label=         "$lodger.i18n.sort.placeholder"

    //-   //-   :placeholder=   "$lodger.i18n.sort.placeholder"
    //-   //-   :id=            "`sort-${ subscriber.name }-${ tax }`"
    //-   //-   :options=       "taxonomy.sortOptions"

    //-   //-   @input=         "subscriber.criteria.sort = { [$event.split('-')[0]] : $event.split('-')[1] }"
    //-   //-   :value=         "Object.keys(subscriber.criteria.sort).length > 0 ? `${Object.keys(subscriber.criteria.sort)[0]}-${subscriber.criteria.sort[Object.keys(subscriber.criteria.sort)[0]]}` : null"

    //-   //-   required=       true
    //-   //-   hide-label
    //-   //- )
    //-     //- .extra(v-if="value" slot-scope= "{ value }")
    //-     //-   span {{ value.split('-')[0] }}
    //-     //-   button(data-icon="x" v-tooltip="`clear`" @click="subscriber.criteria.sort[value.split('-')[0]] = undefined; delete subscriber.criteria.sort[value.split('-')[0]]")

      //- button.new(
      //-   :disabled=    "$lodger[tax].parents && $lodger[tax].parents.length && (!subscriber.refsIds || subscriber.refsIds && Object.values(subscriber.refsIds).filter(v=>v).length < $lodger[tax].parents.length)"
      //-   @click.shift= "taxonomy.put(Object.assign({}, taxonomy.form.fakeData, { ...subscriber.refsIds }))"
      //-   @click=       "$lodger.modal.activeDoc = taxonomy.collection.newDocument({ ...subscriber.refsIds })"
      //- ) +

    //-   //- p(v-if="subscriber.refsIds") {{ subscriber.refsIds }}
    //-   //- p(v-if="subscriber.criteria") {{ subscriber.criteria.filter || 'no filters' }}

    //- li(
    //-   slot= "item"
    //-   slot-scope="{ item, subscriber, taxonomy }"

    //-   :class= "{ last: taxonomy && item[subscriber.primaryPath] === taxonomy.lastItems[0], selected: taxonomy && String(taxonomy.subscribers[subscriberName].selectedId).indexOf(item[subscriber.primaryPath]) > -1 }"
    //-   @click= "subscriber.select(item[subscriber.primaryPath])"
    //- )
    //-   viw(
    //-     v-for=  "key, i in [ ...taxonomy.form.previewFields.filter(f => f.indexOf('Id') !== f.length - 2), 'counters' ]"
    //-     :type=  "key",
    //-     :key=   "key",
    //-     :value= "['suma', 'balanta'].indexOf(key) > -1 ? { suma: item[key], moneda: item.moneda } : item[key]"
    //-     :avatarSeed= "item['name']"
    //-     @click= "subscriber.edit(item[subscriber.primaryPath])"
    //-   )

  //- .stats(slot="sidebar")
  //-   h3 stats

  //-   h4 Ultimele 30 de zile

  //- .widget(slot="sidebar")
  //-   h3 latest actions

  section.welcome(v-if="!$lodger.activeUserId")
    h1 {{ $lodger.i18n.welcome.title }}
    p.intro {{ $lodger.i18n.welcome.intro }}

    field.lang(
      type=       "select"
      id=         "lang-intro"
      :label=     "$lodger.i18n.forms.preferences.fields.lang"
      :options=   "$lodger.supportedLangs"
      v-model=    "$lodger.locale"
      data-styl=       "unstyled"
    )

    .actions(v-if="!$lodger.modal.activeDoc")
      buton(size="large" icon="database" :shortkeys="['i']" @click="debug('import')") {{ $lodger.i18n.welcome.actions.import }}
      buton(primary size="large" arrow="right" @click="newUser" :shortkeys="['enter']") {{ $lodger.i18n.welcome.actions.newUser }}

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
          href: `/${ this.$lodger.teme[this.tema] }.css`
        }
      ]
    };
  },

  data () {
    return {
      tema: this.$lodger.state.appPreferences.display.tema
    }
  },

  created () {
    const { display } = this.$lodger.state.appPreferences
    display.tema = display.tema || 0
    reaction(() => display.tema, (t) => {
      this.tema = t
    })
  },

  computed: {
    subscriberName () {
      return this.$lodger.mainSubName
    },
    taxAsPlural () {
      return p => p.indexOf('Id') === p.length - 2 ? p.replace('Id').plural : p
    }
  },
  methods: {
    newUser () {
      const { $lodger: { utilizatori, mainSubName, modal } } = this
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
