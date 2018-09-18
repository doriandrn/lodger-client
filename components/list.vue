<template lang="pug">
.list
  p.empty(v-if="!ids.length") gol
  buton(@click="add(taxonomy, fakeData(taxonomy))") + {{ taxonomy }}
  
  h3(v-if="ids.length") {{ ids.length }}/{{ itemsCount }} {{ plural }}
  field.sort(
    v-if=     "ids.length > 1"
    type=     "radios",
    label=    "sort.label"
    v-model=  "criteriu.sort"
    id=       "filtruSortare"
    :options=  "sortOptions"
    required= true
  )
  //- p last: {{ $lodger.getters['asociatie/last'] }}
  ul(v-if="items && ids.length && itemsCount")
    li(
      v-for=  "item, id in items"
      :data-id=    "id"
      :class= "{ last: last === id, selected: selected === id }"
      @click= "select(id)"
    ) #[strong {{ item.name }}]
      .item__controls
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
    buton
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
        sort: 'la',
        find: {}
      },
      itemsCount: 0
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
  // get lodgerForm () {
  //   return this.$lodger._getForm(this.taxonomy)
  // }

  created () {
    this.faker = faker
    this.sub()
  }

  async add () {
    const { activeReferenceId, taxonomy } = this
    const refId = activeReferenceId
    
    const { refTax, debug } = this
    if (!refTax && taxonomy !== 'asociatie') {
      throw new LodgerError(Errors.missingReferenceId)
    }

    if (taxonomy !== 'asociatie') Object.assign(arguments[1], { [`${refTax}Id`]: refId })

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

    switch (taxonomy) {
      case 'asociatie':
        return { name }

      case 'bloc':
        return {
          name: faker.random.alphaNumeric()
        }
    }
  }

  get sortOptions () {
    // return { la: { label: 'sort.la' } }
    return { la: { label: 'sort.la' }, name: { label: 'sort.az' } }
    // return { la: { label: 'sort.la' }, suma: { label: 'sort.suma' }, nrChintanta: { label: 'sort.nrChitanta' } }
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
   * Reference Taxonomy for 
   * eg. 'bloc' are ref 'asociatie'
   * 
   */
  get refTax () {
    const { taxonomy } = this
    if (!taxonomy) return

    switch (taxonomy) {
      case 'bloc':
        return 'asociatie'
    }

    return
  }

  /**
   * Subscriber method for items
   */
  sub () {
    this.$lodger.subscribe(
      this.items,
      this.plural,
      this.criteriu,
      undefined,
      this.$data
    )
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
colors = config.palette
typeColors = config.typography.palette

.list
  .sort
    margin-bottom 20px
  ul
    background: colors.bgs.ui

  li
    display flex
    flex-flow row nowrap
    padding 8px

    strong
      font-weight 400
      font-size 14px
      color: typeColors.heading

    &:not(:last-child)
      border-bottom: 1px solid colors.borders

    &.selected
      color red

  .item
    &__controls
      margin-left auto
      display flex
      flex-flow row nowrap

      *
        line-height 14px

      > button:first-child
        margin-left 64px

      button
        background transparent
</style>
