<template lang="pug">
.list
  split.list__header
    .top
      h2.list__heading {{ plural }}
       //|{{ references && references.length ? references[0] : '' }}

      buton(
        @click=     "$emit('new')"
        :disabled = "!referencesIds"
        styl=       "unstyled"
        icon=       "plus"
        icon-only
      ) adauga

    .bottom
      span(v-if="ids.length") {{ ids.length }}/{{ itemsCount }}

    //- buton(slot="right") ceva

  p.empty(v-if="!ids.length") gol
  //- empty(v-if="!ids.length") gol

  //- h4(v-if="_selectedDoc && _selectedDoc._id") {{ _selectedDoc._id }}
  field.sort(
    v-if=     "ids.length > 1"
    type=     "radios",
    label=    "sort.label"
    v-model=  "criteriu.sort.key"
    :id=       "`sort-${taxonomy}`"
    :options=  "sortOptions"
    required= true
    @click=    "handleSortClick"
    :class=     "{ reverseActive: criteriu.sort.direction < 1}"
  )

  ul(
    v-if=     "items && ids.length"
    :class=   "{ fetching }"
  )
    li(
      v-for=  "item, id in items"
      :data-id=    "id"
      :class= "{ last: last === id, selected: selected && selected.length && selected.contains(id) }"
      @click= "select(id)"
    )
      split
        div(
          v-if=   "__displayItemLocations"
          v-for=  "location in Object.keys(__displayItemLocations)"
          :class= "location"
          )
          viw(
            v-for=  "key in __displayItemLocations[location]"
            v-if=   "item[key] && __displayItemLocations[location] && key !== 'moneda'"
            :type=  "key",
            :key=   "key",
            :value= "['suma', 'balanta'].indexOf(key) > -1 ? { suma: item[key], moneda: item.moneda } : item[key]"
            :class= "`${taxonomy}__${key}`"
          )

        .item__controls(slot="right")
          buton(
            @click= "$emit('edit', item)"
            styl=   "unstyled"
            icon=   "edit"
            tooltip
            icon-only
          ) modifica
          buton(
            @click= "$emit('trash', id)"
            styl=   "unstyled"
            icon=   "trash"
            dangerous= true
            tooltip
            icon-only
          ) sterge


  buton.more(
    v-if="ids && ids.length < itemsCount"
    @click="criteriu.limit = criteriu.limit + criteriu.limit"
  ) ...
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
// import { State, Action, Getter } from 'vuex-class'
import { Action } from 'vuex-class'
import { LodgerError } from 'lodger/lib/Errors'
import { assignRefIdsFromStore } from 'lodger/lib/helpers/forms'

/** Components Imports */
import field from 'form/field'
import empty from 'c/empty'
import buton from 'form/button'
import bani from 'c/bani'
import viw from 'c/viewElement'
import split from 'c/split'

enum Errors {
  missingReferenceId = 'Missing reference ID'
}

// one per list, it's not reactive, just a hodlder
let activeDocument

@Component({
  props: {
    taxonomy: {
      type: [String, Array]
    },

    items: {
      type: Object,
      default: () => {}
    },

    showElements: {
      type: Object,
      default: () => {}
    },

    /**
     * reference taxonomies
    */
    referencesIds: {
      type: Object,
      default: null
    },

    /**
     * Selected item(s)
     */
    selected: {
      type: Array,
      default: () => []
    },

    sortOptions: {
      type: Object,
      default: null
    },

    /**
     * Last added item's ID
     */
    last: {
      type: String,
      default: null
    },

    // for multiple taxonomies
    plural: {
      type: String,
      default: undefined
    }
  },
  watch: {
    // /**
    //  * Resubscribe everytime the crit changes
    //  */
    // criteriu: {
    //   handler () {
    //     this.debug('change handler callD')
    //     this.sub(this.subscriber)
    //   },
    //   deep: true
    // },
    // /**
    //  *
    //  */
    // referencesIds: {
    //   handler (newVal, oldval) {
    //     if (!newVal) return
    //     const { references, debug } = this
    //     if (!references.length) return

    //     debug('schimbat la', newVal, 'de la', oldval)

    //     Object.keys(newVal).forEach(refTaxId => {
    //       Vue.set(this.criteriu.find, refTaxId, newVal[refTaxId])
    //     })
    //   }
    // }
  },
  components: {
    empty,
    field,
    buton,
    bani,
    viw,
    split
  }
})
export default class ListTaxonomyItems extends Vue {
  itemsCount = 0
  fetching = false
  criteriu = {
    limit: 5,
    sort: {
      key: 'la',
      direction: 1
    },
    find: {}
  }
  /**
   * Used for multiple taxonomies subcribers
   * eg. transactii / transactions
   */
  combinedItems = {}

  // get Items () {
  //   // return this.items
  //   try {
  //     const { combinedItems, items } = this.$data
  //     this.debug('CI', combinedItems, 'I', items)
  //     if (! (combinedItems && Object.keys(combinedItems).length))
  //       return items
  //     const combined = {}
  //     Object.keys(combinedItems).forEach(tax => {
  //       Object.assign(combined, { ...combinedItems[tax] })
  //     })
  //     return combined
  //   } catch (e) {
  //     this.debug('wtf happened', e)
  //   }
  // }

  get ids () {
    return Object.keys(this.items || {})
  }

  // commd bcoz not needed so far
  // get lodgerForm () {
  //   return this.__forms.length ? this.__forms[0] : this.__forms
  // }

  // get __forms () {
  //   const ar = []
  //   const { taxonomy } = this
  //   const taxes =
  //     typeof taxonomy === 'string' ?
  //       Array(taxonomy) :
  //       taxonomy

  //   taxes.forEach(tax => {
  //     ar.push(this.$lodger._formData(tax))
  //   })
  //   return ar.length > 1 ? ar : ar[0]
  // }



  get __displayItemLocations () {
    const { showElements } = this
    const locations = Object.values(showElements).filter((item, pos, self) => self.indexOf(item) === pos)
    const o = {}
    if (!(locations && locations.length)) return o
    locations.forEach(location => {
      o[location] = Object.keys(showElements).filter(el => showElements[el] === location)
    })
    return o
    // const locations = [
    //   'primary',
    //   'secondary',
    //   'details'
    // ]
    // const o = {}
    // locations.map(loc => {
    //   o[loc] = this.__displayItemKeys(loc)
    // })
    // return o
  }

  /**
   * END
   */

  created () {
    this.$emit('created')
  }

  handleSortClick (e) {
    this.debug('sort clickd', e)
    const { checked } = e
    const { direction } = this.criteriu.sort
    if (checked) {
      this.criteriu.sort.direction = direction > 0 ? -1 : 1
    } else {
      // default
      this.criteriu.sort.direction = 1
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette
typeColors = config.typography.palette

.list
  &__heading
    margin-bottom 0

  &__header
    max-height 60px
    margin-bottom 0

    .top
      display flex
      flex-flow row nowrap
      align-items center

      > *:not(:first-child)
        margin-left 20px

    .left
      display flex
      flex-flow column nowrap
      align-items flex-start

      > *
        flex 1 1 100%

  .split
    .left
      flex-flow column nowrap
      align-items flex-start

  .sort
    background-color: rgba(black, .05)


  ul
    position relative
    background: colors.bgs.ui
    padding 0
    max-height 300px
    overflow auto
    position relative

    &:before
      content ''
      position absolute 0
      z-index -1
      background-color white
      background-image embedurl('~static/loaders/preload.svg')
      background-position 50% 50%
      background-repeat no-repeat
      transform translateY(-100%)
      transition transform .15s ease-out

    &.fetching
      &:before
        z-index 5
        transform translateY(0)


  li
    display flex
    flex-flow row nowrap
    padding 8px
    position relative
    overflow hidden

    strong
      font-weight 400
      font-size 14px
      display inline
      color: typeColors.headings

    &.last
      strong
        &:after
          content ''
          display inline-block
          vertical-align middle
          bubble()

    &:not(:last-child)
      border-bottom: 1px solid colors.borders

    &.selected
      strong
        color: colors.primary !important

    &:hover
    &:active
      .item
        &__controls
          right 0

  .item
    &__controls
      margin-left auto
      display flex
      flex-flow row nowrap
      position absolute
      right -120px
      transition right .1s ease

      *
        line-height 14px

      > button:first-child
        margin-left 64px

      button
        background transparent
</style>
