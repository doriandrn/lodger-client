<template lang="pug">
.list
  button(@click="add(taxonomy, fakeData(taxonomy))") + {{ taxonomy }}
  
  h3 {{ ids.length }}/{{ itemsCount }} {{ plural }}
  field(
    type=     "radios",
    label=    "sort.label"
    v-model=  "criteriu"
    id=       "filtruSortare"
    :options=  "sortOptions"
    required= true
  )
  //- p last: {{ $lodger.getters['asociatie/last'] }}
  ul(v-if="itemsCount")
    li(
      v-for=  "item, id in items"
      :class= "{ active: last === id }"
      @click= "select(id)"
    ) {{ item.name }}
      .item__controls
        button(@click="remove(taxonomy, id)") -
  
  button.more(
    v-if="ids.length < itemsCount"
    @click="criteriu.limit = criteriu.limit + criteriu.limit; sub()"
  ) MOR
</template>

<script lang="ts">
import Vue from 'vue'
import faker from 'faker'
import Component from 'vue-class-component'
import { State, Action, Getter } from 'vuex-class'

/** Components Imports */
import field from 'form/field'

@Component({
  props: {
    taxonomy: {
      type: String,
      required: true,
      default: 'asociatie'
    }
  },
  watch: {
    items () {
      this.itemsCount = this.$lodger.db[this.plural].length
    }
  },
  components: {
    field
  }
})
export default class ListTaxonomyItems extends Vue {
  data () {
    return {
      items: {},
      criteriu: {
        limit: 5
      },
      itemsCount: 0
    }
  }

  get ids () {
    return Object.keys(this.items)
  }

  get last () {
    return this.$store.getters[`${this.taxonomy}/last`]
  }

  created () {
    this.faker = faker
    this.sub()
    this.debug(this.$lodger)
  }

  async add () {
    return await this.$lodger.put(...arguments)
  }

  async remove () {
    return await this.$lodger.trash(...arguments)
  }

  select () {
    const { taxonomy, $store: { commit }} = this
    commit(`${taxonomy}/select`, ... arguments)
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
          
        }
    }
  }

  get sortOptions () {
    return { la: { label: 'sort.la' } }
    // return { la: { label: 'sort.la' }, nume: { label: 'sort.nume' } }
    // return { la: { label: 'sort.la' }, suma: { label: 'sort.suma' }, nrChintanta: { label: 'sort.nrChitanta' } }
  }

  get plural () {
    // TODO!
    const plural = this.$lodger.plurals.get(this.taxonomy)
    this.debug('PLURAL', plural)
    if (!plural) {
      throw new Error('no plural definiton found, component could not init')
    }
    return plural
  }

  /**
   * Subscriber method for items
   */
  sub () {
    this.$lodger.subscribe(this.items, this.plural, this.criteriu)
  }
}
</script>

<style lang="stylus">
.list
  max-width 300px
  li
    display flex
    flex-flow row nowrap
    line-height 14px
    font-size 10px
    &.active
      color red

  .item
    &__controls
      margin-left auto

      *
        line-height 14px

      button
        background transparent
</style>
