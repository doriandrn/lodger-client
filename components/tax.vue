<template lang="pug">
renderlessTax(
  v-if=             "taxonomy"
  :taxonomy=        "taxonomy"
  :subscriberName=  "subscriberName"
  :criteria=        "criteria"
  @input=           "$emit('input', $event)"
)
  //- button.new(
  //-   v-if=         "subscriber"
  //-   slot-scope=   "{ subscriber }"
  //-   type=         "button"
  //-   :disabled=    "taxonomy.parents && taxonomy.parents.length && (!subscriber.refsIds || subscriber.refsIds && Object.values(subscriber.refsIds).filter(v=>v).length < taxonomy.parents.length)"
  //-   @click.shift= "debug('omfg', Object.assign({}, taxonomy.form.fakeData, { ...subscriber.refsIds })); taxonomy.put(Object.assign({}, taxonomy.form.fakeData, { ...subscriber.refsIds }))"
  //-   @click=       "debug('wtt'); $lodger.modal.activeDoc = taxonomy.collection.newDocument({ ...subscriber.refsIds })"
  //- ) ++
  //-   span(v-if="subscriber.refsIds") {{ Object.keys(subscriber.refsIds) }} {{ Object.values(subscriber.refsIds) }}
  li(
    slot= "item"
    slot-scope="{ item, subscriber, taxonomy }"

    v-if= "!(hideSelectedItem && item[subscriber.primaryPath] === subscriber.selectedId)"
    :class= "{ last: taxonomy && item[subscriber.primaryPath] === taxonomy.lastItems[0], selected: taxonomy && String(taxonomy.subscribers[subscriberName].selectedId).indexOf(item[subscriber.primaryPath]) > -1 }"
    @click= "subscriber.select(item[subscriber.primaryPath])"
  )
    viw(
      v-for=  "key, i in previewFields.filter(f => f.indexOf('Id') !== f.length - 2)"
      :type=  "key",
      :key=   "key",
      :value= "['suma', 'balanta'].indexOf(key) > -1 ? { suma: item[key], moneda: item.moneda } : item[key]"
      :avatarSeed= "item['name']"
      @click= "subscriber.edit(item[subscriber.primaryPath])"
    )
p(v-else)  invalid tax
</template>

<script>
import renderlessTax from 'c/renderlessTax'
import viw from 'c/viewElement'

export default {
  components: {
    renderlessTax,
    viw
  },
  props: {
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
    subscriberName: {
      type: String,
      default: 'TaxWithNoSubName'
    },
    hideSelectedItem: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette
typeColors = config.typography.palette

[data-tax]
  width 100%

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
    margin -4px

    > *
      margin 4px

    > :last-child
      margin-left 20px

    +above(l)
      padding 16px 20px
      border-radius 6px
      margin 4px 0

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
      display inline
      white-space nowrap
      color: typeColors.headings
      margin-right auto
      max-width: 170px;
      text-overflow: ellipsis;
      overflow: hidden

      &:first-of-type
        &:hover
          text-decoration underline

    &.last
      > strong:first-of-type
        &:after
          content ''
          display inline-block
          vertical-align middle
          bubble()

    // &:not(:last-child)
    //   border-bottom: 1px solid colors.borders

    &.selected
      background: colors.bgs.ui
      // > strong:first-of-type
      //   color: colors.primary !important

    &:hover
    &:active
      .item
        &__controls
          right 0

  ul
    margin 0 -8px
    width calc(100% + 16px)
    position relative
    padding 0
    max-height 300px
    overflow auto
    position relative

    &.ms
      li
        padding 8px
        justify-content: flex-start;
        align-items: baseline;

        *
          margin-top 1px
          margin-bottom 1px

          &:nth-child(4)
            margin-left 44px

        strong
          flex 1 1 33%

        .bani
          flex 1 0 50%

        &:not(.selected)
          .impartire
            display none

    &.fetching
      &:before
        z-index 5
        transform translateY(0)

  header
    &+ul
      margin-top 8px
      padding-top 8px
      border-top 1px solid rgba(black, .05)
</style>
