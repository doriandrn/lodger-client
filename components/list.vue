<template lang="pug">
.list
  split.list__header
    .top
      h2.list__heading {{ plural }} {{ refTax }}
      buton(
        @click="add(taxonomy, fakeData(taxonomy))"
        :disabled = "taxesWithoutRef.indexOf(taxonomy) < 0 && !activeReferenceId"
        styl="unstyled"
        icon="plus"
        icon-only
      ) {{ taxonomy }}

    .bottom
      span(v-if="ids.length") {{ ids.length }}/{{ itemsCount }} 

    //- buton(slot="right") ceva
  
  p.empty(v-if="!ids.length") gol
  
  
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
  //- p last: {{ $lodger.getters['asociatie/last'] }}
  h4(v-if="fetching") loadin'...
  ul(
    v-if=     "items && ids.length && itemsCount"
    :class=   "{ fetching }"
  )
    li(
      v-for=  "item, id in items"
      :data-id=    "id"
      :class= "{ last: last === id, selected: selected === id }"
      @click= "select(id)"
    )
      split
        strong(
          v-if=   "primaryKey"
          :class= "`${taxonomy}__${primaryKey}`"
        ) {{ item[primaryKey] }}
        
        .secondary(v-if="secondaryKeys")
          viw(
            v-for=  "key in secondaryKeys"
            :type=  "key",
            :key=   "key",
            :value= "item[key]"
          )
            //- span {{ key }}: {{ item[key] }}
        details(v-if="detailsKeys && detailsKeys.length")
          div(
            v-for="detail in detailsKeys"
          )
            bani(
              v-if=     "detail === 'balanta'"
              :valoare= "item.balanta"
            )
            span(v-else) {{detail}}: {{ item[detail] }}

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
    v-if="ids.length < itemsCount"
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

/** Components Imports */
import field from 'form/field'
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
      type: String,
      required: true,
      default: 'asociatie'
    }
  },
  watch: {
    /**
     * Resubscribe everytime the crit changes
     */
    criteriu: {
      handler () {
        this.debug('change handler callD')
        this.sub()
      },
      deep: true
    },
    /**
     * 
     */
    activeReferenceId (newVal) {
      if (!newVal) return

      const { refTax, debug } = this
      if (!refTax) return

      debug('schimbat', newVal)

      this.criteriu.find = { [`${refTax}Id`]: newVal }
      // Object.assign(this.criteriu.find, { [`${refTax}Id`]: newVal })
    }
  },
  components: {
    field,
    buton,
    bani,
    viw,
    split
  }
})
export default class ListTaxonomyItems extends Vue {
  @Action('notify') notifyUser: any
  @Action('open', { namespace: 'modal' }) openModal: any

  data () {
    return {
      items: {},
      criteriu: {
        limit: 5,
        sort: {
          key: 'la',
          direction: 1
        },
        find: {}
      },
      itemsCount: 0,
      fetching: false
    }
  }

  get ids () {
    const { items } = this
    return Object.keys(items)
  }

  get last () {
    return this.$store.getters[`${this.taxonomy}/last`]
  }

  get selected () {
    return this.$store.getters[`${this.taxonomy}/selected`]
  }

  // commd bcoz not needed so far
  get lodgerForm () {
    return this.$lodger._getForm(this.taxonomy)
  }

  /**
   * START: Related to displaying items
   * 
   */
  get primaryKey () {
    const primaryField = this.lodgerForm.fields.filter(field => field.showInList === 'primary')[0]
    if (!primaryField) return
    return primaryField.id
  }

  get detailsKeys () {
    return this.lodgerForm.fields
      .filter(field => field.showInList === 'details')
      .map(field => field.id)
  }

  get secondaryKeys () {
    const keys = this.lodgerForm.fields
      .filter(field => field.showInList === 'secondary')
      .map(field => field.id)

    if (this.taxonomy !== 'serviciu') keys.push('la')
    return keys
  }
  /**
   * END
   */

  created () {
    this.faker = faker
    this.sub()
  }

  async add () {
    const { activeReferenceId, taxonomy, taxesWithoutRef } = this
    const refId = activeReferenceId
    
    const { refTax, debug } = this
    if (!refTax && taxesWithoutRef.indexOf(taxonomy) < 0) {
      throw new LodgerError(Errors.missingReferenceId)
    }

    if (taxesWithoutRef.indexOf(taxonomy) < 0) Object.assign(arguments[1], { [`${refTax}Id`]: refId })

    try {
      return await this.$lodger.put(...arguments)
    } catch (e) {
      this.debug('e', e)
      this.notifyUser({
        type: 'error', text: String(e)
      })
    }
  }

  async remove () {
    return await this.$lodger.trash(...arguments)
  }

  select () {
    const { taxonomy, $store: { commit }} = this
    commit(`${taxonomy}/select`, ... arguments)
  }

  /**
   * For taxonomies that have references
   * this is the referred id
   */
  get activeReferenceId () {
    const { taxonomy, $store: { commit, getters }} = this
    if (!taxonomy) return

    const { refTax, debug } = this
    if (!refTax) return

    return getters[`${refTax}/active`] || getters[`${refTax}/selected`]
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
        return { name, moneda }

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
    const plural = this.$lodger.plurals.get(this.taxonomy)
    if (!plural) {
      throw new Error('no plural definiton found, component could not init')
    }
    return plural
  }

  /**
   * Reference Taxonomy for taxonomy
   * eg. 'bloc' are ref 'asociatie'
   * 
   */
  get refTax () {
    const { taxonomy } = this
    if (!taxonomy) return

    switch (taxonomy) {
      case 'bloc':
        return 'asociatie'

      case 'apartament':
        return 'bloc'

      case 'incasare':
        return 'apartament'

      case 'cheltuiala':
        return 'asociatie'
    }

    return
  }

  get taxesWithoutRef () {
    return ['asociatie', 'furnizor', 'serviciu']
  }

  /**
   * Subscriber method for items
   */
  sub () {
    this.fetching = true
    this.$lodger.subscribe(
      this.items,
      this.plural,
      this.criteriu,
      undefined,
      this.$data
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
    margin-bottom 20px

    
  ul
    background: colors.bgs.ui

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
      position relative
      right -120px
      transition right .1s ease

      *
        line-height 14px

      > button:first-child
        margin-left 64px

      button
        background transparent
</style>
