<template lang="pug">
.list
  split.list__header
    .top
      h2.list__heading {{ plural }}
        em(
          v-for="ref in references"
          :class="{ active: referencesIds[`${ref}Id`] }"
        ) {{ ref }}

      buton(
        @click=     "$emit($event.shiftKey ? 'fakeNew' : 'new')"
        :disabled = "!allReferencesHaveValues"
        styl=       "unstyled"
        icon=       "plus"
        icon-only
      ) adauga

    .bottom
      //- span(v-if="ids.length") {{ ids.length }}/{{ itemsCount }}

    //- buton(slot="right") ceva

  p.empty(v-if="!ids.length") gol
  //- empty(v-if="!ids.length") gol

  //- h4(v-if="_selectedDoc && _selectedDoc._id") {{ _selectedDoc._id }}
  field.sort(
    v-if=     "ids.length > 1"
    type=     "radios",
    label=    "sort.label"
    v-model=  "_sort"
    :id=       "`sort-${taxonomy}`"
    :options=  "sortOptions"
    required= true
    @click=    "changeSortDirectionIfChecked"
    :class=     "{ reverseActive: criteriu.sort.direction < 1}"
  )

  ul(
    v-if=     "items && ids.length"
    :class=   "{ fetching }"
  )
    li(
      v-for=  "item, id in items"
      :data-id=    "id"
      :class= "{ last: last === id, selected: typeof selected === 'string' ? selected === id : selected.length && selected.contains(id) }"
      @click= "$emit('select', id)"
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
import { getCriteriu } from 'lodger/lib/helpers/functions'

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

    criteriu: {
      type: Object,
      default: () => {}
    },

    /**
     * reference taxonomies
    */
    references: {
      type: Array,
      default: null
    },

    /**
     * Selected item(s)
     * array for multiple selects
     */
    selected: {
      type: [String, Array],
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
    xfind: {
      handler (newVal) {
        this.debug('XXX', newVal)
        // this.$emit('subscribe', newVal)
      },
      deep: true
    },
    // /**
    //  *
    //  */
    // referencesIds: {
    //   deep: true,
    //   handler (newVal, oldval) {
    //     if (!newVal) return
    //     this.debug('schimbat la', newVal, 'de la', oldval)
    //     this.$emit('subscribe', { find: newVal })
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
  xfind = this.referencesIds
  // criteriu = {
  //   limit: 5,
  //   sort: {
  //     key: 'la',
  //     direction: 1
  //   },
  //   find: {}
  // }
  /**
   * Used for multiple taxonomies subcribers
   * eg. transactii / transactions
   */
  // combinedItems = {}

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

  // get criteriu () {
  //   const { taxonomy, referencesIds, debug } = this
  //   let criteriu = getCriteriu(taxonomy)
  //   if (!referencesIds) return criteriu
  //   Object.assign(criteriu.find, referencesIds)
  //   debug('criteriu', criteriu)
  //   return criteriu
  //   // Object.keys(referencesIds).forEach(refTaxId => {
  //   //   Vue.set(this.criteriu.find, refTaxId, newVal[refTaxId])
  //   // })
  // }

  get ids () {
    return Object.keys(this.items || {})
  }

  get referencesIds () {
    const reffies = this.$lodger.activeReferencesIds(this.references)
    if (!reffies) return
    if (!this.criteriu) return reffies
    const { criteriu } = this

    const { find } = criteriu
    this.debug('F', find)
    if (find) {
      let same = true
      Object.keys(reffies).forEach(ref => {
        if (!reffies[ref]) return
        this.debug('ref', ref)
        if (reffies[ref] !== find[ref]) same = false
      })
      this.debug('same', same)
      if (!same) this.debug('!same!!!')
    }
    this.debug('refIds getter !', reffies)

    return reffies
  }

  /**
   * This knows when to show the add button,
   * checks if references provided exist so the add goes ok
   */
  get allReferencesHaveValues () {
    const { referencesIds } = this
    let HV = true
    if (!referencesIds) return HV

    Object.values(referencesIds).forEach(val => {
      if (val === undefined) { HV = false }
    })

    return HV
  }

  get __displayItemLocations () {
    const { showElements } = this
    const locations = Object.values(showElements).filter((item, pos, self) => self.indexOf(item) === pos)
    const o = {}
    if (!(locations && locations.length)) return o
    locations.forEach(location => {
      o[location] = Object.keys(showElements).filter(el => showElements[el] === location)
    })
    return o
  }

  created () {
    this.$emit('subscribe')
  }

  get _sort () {
    return Object.keys(this.criteriu.sort || {})[0]
  }

  set _sort (e) {
    this.$emit('subscribe', { sort: { key: e } })
  }

  get _find () {
    return this.criteriu.find
  }

  changeSortDirectionIfChecked (e) {
    const { index, checked } = e
    if (!checked) return

    const direction = this.criteriu.sort[index] > 0 ? -1 : 1
    const sort = {
      direction,
      key: index
    }
    this.debug('newsort', sort, e),
    this.$emit('subscribe', { sort })
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

    em
      font-size 10px
      margin 0 10px
      opacity .5

      &.active
        opacity 1
        color blue

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
