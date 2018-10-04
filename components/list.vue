<template lang="pug">
.list
  split.list__header
    .top
      h2.list__heading {{ plural }} {{ references && references.length ? references[0] : '' }}
        //- @click=     "add(taxonomy, fakeData(taxonomy))"
      buton(
        @click=     "$event.shiftKey ? add(taxonomy, fakeData(taxonomy), references) : openModal(`${taxonomy}.new`)"
        :disabled = "taxesWithoutRef.indexOf(taxonomy) < 0 && !references"
        styl=       "unstyled"
        icon=       "plus"
        icon-only
      ) {{ taxonomy }}

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
      v-for=  "item, id in Items"
      :data-id=    "id"
      :class= "{ last: last === id, selected: selected === id }"
      @click= "select(id)"
    )
      split
        div(
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
            @click= "openModal({ id: `${taxonomy}.edit`, data: item })"
            styl=   "unstyled"
            icon=   "edit"
            tooltip
            icon-only
          ) modifica
          buton(
            @click= "remove(taxonomy, id)"
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
import faker from 'faker'
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
      type: [String, Array],
      required: true,
      default: 'asociatie'
    },
    /**
     * Pentru contoare si servici si ce-o mai fi
     */
    multipleSelect: {
      type: Boolean,
      default: false
    },
    /**
     * reference taxonomies
    */
    references: {
      type: [String, Array],
      default: null
    },
    subscriber: {
      type: String,
      default: undefined
    },

    // for multiple taxonomies
    _plural: {
      type: String,
      default: undefined
    }
  },
  watch: {
    /**
     * Resubscribe everytime the crit changes
     */
    criteriu: {
      handler () {
        this.debug('change handler callD')
        this.sub(this.subscriber)
      },
      deep: true
    },
    /**
     *
     */
    referencesIds: {
      handler (newVal, oldval) {
        if (!newVal) return
        const { references, debug } = this
        if (!references.length) return

        debug('schimbat la', newVal, 'de la', oldval)

        Object.keys(newVal).forEach(refTaxId => {
          Vue.set(this.criteriu.find, refTaxId, newVal[refTaxId])
        })
      }
    }


    // async selected (newId) {
    //   const col = this.$lodger._getCollection(this.plural)
    //   console.info('CIOL', col)
    //   // const doc = await col.findOne(newId).exec()
    //   if (typeof col.selected !== 'function') return
    //   activeDocument = await col.selected(newId)
    //   // const frozen = Object.freeze(doc)
    //   // console.info('DIO', frozen)
    //   // if (!this.selectedDoc) {
    //   //   Object.defineProperty(this, 'selectedDoc', {
    //   //     configurable: false,
    //   //     value: frozen
    //   //   })
    //   // } else {
    //   //   this.selectedDoc = frozen
    //   // }
    //   // this.selectedDoc = frozen
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
  @Action('open', { namespace: 'modal' }) openModal: any
  _docs = []
  items = {}
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

  get Items () {
    // return this.items
    try {
      const { combinedItems, items } = this.$data
      this.debug('CI', combinedItems, 'I', items)
      if (! (combinedItems && Object.keys(combinedItems).length))
        return items
      const combined = {}
      Object.keys(combinedItems).forEach(tax => {
        Object.assign(combined, { ...combinedItems[tax] })
      })
      return combined
    } catch (e) {
      this.debug('wtf happened', e)
    }
  }

  get ids () {
    const { Items } = this
    if (!Items) return []
    return Object.keys(Items)
  }

  get last () {
    return this.$store.getters[`${this.taxonomy}/last`]
  }

  get selected () {
    return this.$store.getters[`${this.taxonomy}/selected`]
  }

  // commd bcoz not needed so far
  get lodgerForm () {
    return this.__forms.length ? this.__forms[0] : this.__forms
  }

  get __forms () {
    const ar = []
    const { taxonomy } = this
    const taxes =
      typeof taxonomy === 'string' ?
        Array(taxonomy) :
        taxonomy

    taxes.forEach(tax => {
      ar.push(this.$lodger._formData(tax))
    })
    return ar.length > 1 ? ar : ar[0]
  }

  /**
   * START: Related to displaying items
   *
   */
  get __displayItemKeys () {
    const { fields } = this.lodgerForm

    return slot => {
      if (!fields) return slot
      return fields
        .filter(field => field.showInList === slot)
        .map(field => field.id)
    }
  }

  get __displayItemLocations () {
    const locations = [
      'primary',
      'secondary',
      'details'
    ]
    const o = {}
    locations.map(loc => {
      o[loc] = this.__displayItemKeys(loc)
    })
    return o
  }

  /**
   * END
   */

  created () {
    this.faker = faker
    this.sub()
  }

  async add () {
    this.debug('add clicat')
    return await this.$lodger.put(...arguments)
  }

  async remove () {
    return await this.$lodger.trash(...arguments)
  }

  select () {
    const {
      taxonomy,
      $store: { commit, getters },
      multipleSelect,
      debug
    } = this
    debug('item to select clicked')
    // if (!multipleSelect) {
    this.$lodger.select(
      taxonomy,
      ... arguments,
      multipleSelect
    )
    // } else {
      // const refDoc = getters[`${refTax}/activeDoc`]

    // }
  }

  /**
   * For taxonomies that have references
   * get the referred ids
   *
   * @returns {Object}
   */

  get referencesIds () {
    const { references, $store: { getters } } = this
    return assignRefIdsFromStore({ references, getters })
  }

  /**
   * TODO: export from here
   * To be removed in production
   */
  fakeData (taxonomy) {
    const name = faker.company.companyName()
    const monede = ['ron', 'usd', 'eur']
    const moneda = faker.random.arrayElement(monede)

    switch (taxonomy) {
      case 'asociatie':
        return {
          name,
          moneda,
          balanta: Number(faker.finance.amount(100, 10000, 4))
        }

      case 'bloc':
        return {
          name: faker.random.alphaNumeric(2)
        }

      case 'apartament':
        return {
          nr: 1,
          proprietar: `${faker.name.firstName()} ${faker.name.lastName()}`,
          etaj: 0,
          scara: 1,
          balanta: faker.random.number({ min: -10000, max: 100 }),
          suprafata: faker.random.number({ min: 20, max: 300 }),
          locatari: faker.random.number({ min: 0, max: 9 })
        }

      case 'incasare':
        return {
          moneda,
          suma: Number(faker.finance.amount(100, 10000, 4)),
          nrChitanta: 1
        }

      case 'factura':
        return {
          nrFactura: 1,
          suma: faker.random.number({ min: -100000, max: -100 }),
          moneda,
          dataScadenta: Date.now() + faker.random.number({ min: 9000000, max: 100000000 })
        }

      case 'furnizor':
        return {
          name: faker.company.companyName(),
          servicii: []
          // servicii: faker.random.arrayElement(this.$store.getters[''])
        }

      case 'serviciu':
        return {
          denumire: faker.hacker.adjective()
        }

      case 'cheltuiala':
        return {
          moneda,
          // suma: Number(faker.finance.amount(1000, 10000, 6))
          suma: faker.random.number({ min: -100000, max: -100 }),

        }

      case 'utilizator':
        return {
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          rol: 'administrator'
        }
    }
  }

  /**
   * @returns an object with each key used as a sorting option
   */
  get sortOptions () {
    const { lodgerForm: { fields }, debug } = this

    const indexables = fields
      .filter(field => field.index)
      .map(field => field.id)

    // TODO: !!! ia din common methods
    if (this.taxonomy !== 'serviciu') indexables.push('la')

    const sorts = {}
    indexables.forEach(indexable => {
      const label = `sort.${indexable === 'name' ? 'az' : indexable}`
      Object.assign(sorts, { [indexable]: { label } })
    })

    debug('sorts', sorts)

    return sorts
  }

  get plural () {
    // TODO!
    if (this._plural) return this._plural
    const plural = this.$lodger.plurals.get(this.taxonomy)
    if (!plural) {
      throw new Error('no plural definiton found, component could not init')
    }
    return plural
  }

  get taxesWithoutRef () {
    return ['asociatie', 'furnizor', 'serviciu', 'utilizator']
  }

  /**
   * Subscriber method for items
   */
  sub (subscriberName: string = this.subscriber) {
    this.fetching = true

    this.$lodger.subscribe(
      this.$data,
      this.taxonomy,
      this.plural,
      this.criteriu,
      subscriberName
    )

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
