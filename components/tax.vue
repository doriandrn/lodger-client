<template lang="pug">
renderlessTax(
  v-if=             "taxonomy"
  :id=              "id"
  :taxonomy=        "taxonomy"
  :data-tax=        "taxonomy.plural"
  :subscriber=      "subscriber"
  :itemsExtraData=  "taxonomy.plural === 'apartamente' && value ? { impartire: value } : undefined"
  @input=           "$emit('input', taxonomy.plural === 'apartamente' && subscriberName === 'single' && typeof $event !== 'string' ? $event.reduce((a, b) => ({ ...a, [b]: value && value[b] ? value[b] : undefined }), {}) : $event)"
)
  field(
    v-if= "fuzzy && !disabled"
    slot= "fuzzInput"
    slot-scope=  "{ taxonomy, subscriber }"
    :id=  "`search-${taxonomy.plural}`"
    type= "search"
    @input= "debug($event, go($event, Object.values(subscriber.items).map(v => ({ _id: v._id, [previewFields[0]]: v[previewFields[0]] })), { key: previewFields[0] }))"
    hide-label
  )
  header(
    v-if=       "!fuzzy"
    slot-scope=  "{ taxonomy, subscriber }"
  )

    h3 {{ $l.i18n.taxonomies[taxonomy.plural] ? $l.i18n.taxonomies[taxonomy.plural].plural : taxonomy.plural }}
      small
        //- span(v-if="subscriber.ids.length !== taxonomy.totals") {{ subscriber.ids.length }}
        span(v-if="subscriber.ids.length") {{ subscriber.ids.length }}
        span(v-if="taxonomy.totals") {{ taxonomy.totals }}

    .vm(v-if= "viewModes.length > 1")
      p {{ viewModes[1] }}

    field.sort(
      v-if=           "sortable && subscriber && subscriber.criteria && taxonomy.form.schema.indexes.length && subscriber.ids.length > 1"
      type=           "select"
      :label=         "$l.i18n.sort.placeholder"

      :placeholder=   "$l.i18n.sort.placeholder"
      :id=            "`sort-${ subscriber.name }-${ taxonomy.plural }`"
      :options=       "taxonomy.sortOptions"

      @input=         "subscriber.criteria.sort = { [$event.split('-')[0]] : $event.split('-')[1] }"
      :value=         "Object.keys(subscriber.criteria.sort || {}).length > 0 ? `${Object.keys(subscriber.criteria.sort)[0]}-${subscriber.criteria.sort[Object.keys(subscriber.criteria.sort)[0]]}` : null"

      required=       true
      hide-label
    )

    button.new(
      v-if=         "!disabled && subscriberName.indexOf('single') < 0"
      type=         "button"
      :disabled=    "taxonomy.parents && taxonomy.parents.length && (!subscriber.refsIds || subscriber.refsIds && Object.values(subscriber.refsIds).filter(v=>v).length < taxonomy.parents.length)"
      @click.shift= "devPut"
      @click=       "!disabled ? $l.modal.activeDoc = taxonomy.collection.newDocument({ ...subscriber.refsIds }) : undefined"
    ) +

    p.selControls(v-if=  "!disabled && subscriber.options.multipleSelect")
      span {{ (subscriber.selectedId && subscriber.selectedId.length) || $l.i18n.sel.zeroM }} {{ $l.i18n.sel[`selected${subscriber.selectedId && subscriber.selectedId.length > 1 ? 's' : ''}`] }}
      a.all(
        :data-icon= "subscriber.ids.length === subscriber.selectedId.length ? 'deselAll' : 'selAll'"
        :class=     "subscriber.ids.length !== subscriber.selectedId.length ? 'sel' : 'desel'"
        v-tooltip=  "$l.i18n.sel[`${subscriber.ids.length === subscriber.selectedId.length ? 'de' : ''}selectAll`]"
        @click=     "subscriber.selectedId.length < subscriber.ids.length ? subscriber.select(subscriber.ids.filter(id => subscriber.selectedId.indexOf(id) < 0)) : subscriber.select(subscriber.ids)")

  li(
    slot= "item"
    slot-scope="{ item, subscriber, taxonomy }"
    :key=   "`${taxonomy.plural}-${item._id}`"

    v-if= "!(hideSelectedItem && item[subscriber.primaryPath] === subscriber.selectedId)"
    :class= "{ last: taxonomy && item[subscriber.primaryPath] === taxonomy.lastItems[0], selected: taxonomy && String(taxonomy.subscribers[subscriberName].selectedId).indexOf(item[subscriber.primaryPath]) > -1 }"

    @click= "!disabled ? subscriber.select(item[subscriber.primaryPath]) : undefined"
  )
    viw(
      v-for=  "key, i in displayFields"
      :type=  "key",
      :key=   "key",
      :value= "['suma', 'balanta'].indexOf(key) > -1 ? { suma: item[key], moneda: item.moneda } : item[key]"
      :formData=  "formData"
      @click= "subscriberName !== 'single' ? subscriber.edit(item[subscriber.primaryPath]) : undefined"
    )
p(v-else)  invalid tax
</template>

<script>
import renderlessTax from 'c/renderlessTax'
import viw from 'c/viewElement'
import { Observer } from 'mobx-vue'
import { go } from 'fuzzysort'

export default Observer({
  beforeCreate () {
    this.$options.components.field = require('form/field').default
  },
  computed: {
    displayFields () {
      return this.previewFields
        .concat(this.extraFields)
        .filter(f => f && f.indexOf('Id') !== f.length - 2)
    },
    subscriber () {
      return this.taxonomy.subscribers[this.subscriberName]
    }
  },
  fetch () {
    const { value, selectedId, debug } = this
    if (!value)
      return

    // if (typeof value === 'object')
    //   this.criteria.filter = { '_id': { $in: Object.keys(value) } }

    if (selectedId) {
      const sub = this.taxonomy.subscribers[this.subscriberName]
      if (sub) {
        sub.selectedId = selectedId
      } else
        debug('N-am gasit sub', this.subscriberName, selectedId)
    }
  },
  methods: {
    go,
    async devPut () {
      const { taxonomy, subscriberName } = this
      const { subscribers, form: { fakeData, defaults } } = taxonomy
      const { refsIds } = subscribers[subscriberName]
      const _defaults = await defaults(refsIds)

      taxonomy.put(
        Object.assign({},
          fakeData,
          _defaults,
          { ...refsIds },
          _defaults.balanta ?
            { balanta: fakeData.balanta } :
            {}
        )
      )
    }
  },
  components: {
    renderlessTax,
    viw
  },
  props: {
    id: {
      type: String,
      default: null
    },
    value: {
      type: [Object, Array, String],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    sortable: {
      type: Boolean,
      default: true
    },
    criteria: {
      type: Object,
      default: null
    },
    taxonomy: {
      type: Object,
      required: true
    },
    previewFields: {
      type: Array,
      default () {
        return this.taxonomy.form.previewFields || []
      }
    },
    viewModes: {
      type: Array,
      default: () => ['default']
    },
    extraFields: {
      type: Array,
      default: null
    },
    subscriberName: {
      type: String,
      default: 'TaxWithNoSubName'
    },
    hideSelectedItem: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: null
    },
    selectedId: {
      type: [String, Array],
      default: null
    },
    fuzzy: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette
typeColors = config.typography.palette

.selControls
  flex 1 1 100%
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  a
    &.all
      &.desel
        &:before
          background-color red

      &.sel
        &:before
          background-color green

  > *
    &:not(:first-child)
      margin-left 8px

[data-tax]
  width 100%

  .counters
    flex 1 1 100%
    text-align left

    > span
      font-style italic
      opacity .5

      &:after
        content attr(data-w)
        margin-left 2px

      &:not(:last-child)
        margin-right 8px

  header
    display flex
    flex-flow row wrap
    min-height 40px

    &+p
      padding 12px
      font-style italic

    .new
      size 24px
      line-height 24px
      border-radius 50px
      position: relative;
      right: -8px;
      top: 5px;

  li
    display flex
    flex-flow row wrap
    justify-content space-between
    align-items center
    position relative
    overflow hidden
    padding 11px 12px
    width 100%
    border-radius 4px
    // margin -4px
    margin 4px 0
    background-color rgba(white, .35)

    > *
      margin 4px

    +above(l)
      padding 16px 20px
      border-radius 6px

    .ap__nr
      width 30px
      margin-right 8px
      text-align right
      order -1

    .avatar
      margin-right 12px
      img
        size 32px

    strong
      order 0
      font-weight 400
      font-size 14px
      flex-grow 0
      flex-basis 120px
      text-align left
      display inline
      white-space nowrap
      margin-right auto
      max-width: 170px;
      text-overflow: ellipsis;
      overflow: hidden

      &:first-of-type
        &:hover
          text-decoration underline

    &.last
      > strong:first-of-type
        position relative

        &:after
          content ''
          display inline-block
          vertical-align middle
          bubble()

    // &:not(:last-child)
    //   border-bottom: 1px solid colors.borders

    &.selected
      background: rgba(colors.bgs.ui, .85)
      // > strong:first-of-type
      //   color: colors.primary !important

    &:not(.selected)
      &:hover
      &:active
        background: rgba(colors.bgs.ui, .65)

  ul
  ol
    // margin 0 -8px
    // width calc(100% + 16px)
    position relative
    padding 0
    max-height 300px
    overflow auto
    position relative

    &.ms
      li
        padding 8px
        justify-content: flex-start;
        align-items: center;
        cursor pointer
        line-height 14px

        *
          margin-top 1px
          margin-bottom 1px

        strong
          flex 0 1 40%
          max-width 100%
          text-decoration none !important

        .bani
          flex: 0 0 160px;
          width: auto;
          align-self: flex-end;
          display: inline-flex;
          margin-left: auto;
          text-align: right;

        &:not(.selected)
          .impartire
            display none

    &:not(.ms)
      li
        strong
          color: typeColors.headings

    &.fetching
      &:before
        z-index 5
        transform translateY(0)

  header
    &+ul
    &+ol
      margin-top 8px
      padding-top 8px
      border-top 1px solid rgba(black, .05)


.flip-list-move
  transition: transform .25s;

</style>
