<template lang="pug">
renderlessTax.list(
  :taxonomy=  "taxonomy"
  :subscriberName=  "subscriberName"
)
  button.new(
    slot-scope="{ subscriber }"
    :disabled=    "taxonomy.parents && taxonomy.parents.length && (!subscriber.refsIds || subscriber.refsIds && Object.values(subscriber.refsIds).filter(v=>v).length < $lodger[tax].parents.length)"
    @click.shift= "taxonomy.put(Object.assign({}, taxonomy.form.fakeData, { ...subscriber.refsIds }))"
    @click=       "$lodger.modal.activeDoc = taxonomy.collection.newDocument({ ...subscriber.refsIds })"
  ) +
  li(
    slot= "item"
    slot-scope="{ item, subscriber, taxonomy }"

    v-if= "!(hideSelectedItem && item[subscriber.primaryPath] === subscriber.selectedId)"
    :class= "{ last: taxonomy && item[subscriber.primaryPath] === taxonomy.lastItems[0], selected: taxonomy && String(taxonomy.subscribers[subscriberName].selectedId).indexOf(item[subscriber.primaryPath]) > -1 }"
    @click= "subscriber.select(item[subscriber.primaryPath])"
  )
    viw(
      v-for=  "key, i in taxonomy.form.previewFields.filter(f => f.indexOf('Id') !== f.length - 2)"
      :type=  "key",
      :key=   "key",
      :value= "['suma', 'balanta'].indexOf(key) > -1 ? { suma: item[key], moneda: item.moneda } : item[key]"
      :avatarSeed= "item['name']"
      @click= "subscriber.edit(item[subscriber.primaryPath])"
    )
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
    taxonomy: {
      type: Object,
      required: true
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

.list
  width 100%

  li
    display flex
    flex-flow row nowrap
    justify-content space-between
    align-items center
    position relative
    overflow hidden
    padding 8px
    width 100%

    .ap__nr
      width 30px
      margin-right 8px
      text-align right

    .avatar
      margin-right 12px
      img
        size 32px

    strong
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

    &:not(:last-child)
      border-bottom: 1px solid colors.borders

    &.selected
      > strong:first-of-type
        color: colors.primary !important

    &:hover
    &:active
      .item
        &__controls
          right 0

  ul
    margin 0 -8px
    width calc(100% + 16px)
    position relative
    background: colors.bgs.ui
    padding 0
    max-height 300px
    overflow auto
    position relative

    &.fetching
      &:before
        z-index 5
        transform translateY(0)

  .sort
    margin 0 -8px
    flex 1 1 100%

</style>
