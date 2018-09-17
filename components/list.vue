<template lang="pug">
.list
  p.empty(v-if="!ids.length") gol
  button(@click="add(taxonomy, fakeData(taxonomy))") + {{ taxonomy }}
  
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
  ul(v-if="itemsCount")
    li(
      v-for=  "item, id in items"
      :class= "{ last: last === id, selected: selected === id }"
      @click= "select(id)"
    ) {{ item.name }}
      .item__controls
        button(@click="remove(taxonomy, id)") -
  
  button.more(
    v-if="ids.length < itemsCount"
    @click="criteriu.limit = criteriu.limit + criteriu.limit"
  ) MOR
</template>

<script lang="ts">
import Vue from 'vue'
import faker from 'faker'
import Component from 'vue-class-component'
// import { State, Action, Getter } from 'vuex-class'
import { Action } from 'vuex-class'

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
    // items () {
    //   this.itemsCount = this.$lodger.db[this.plural].length
    // },
    criteriu: {
      handler () {
        this.sub()
      },
      deep: true
    }
  },
  components: {
    field
  }
})
export default class ListTaxonomyItems extends Vue {
  @Action('notify') notifyUser: any
  data () {
    return {
      items: {},
      criteriu: {
        limit: 5,
        sort: 'la'
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

  get selected () {
    return this.$store.getters[`${this.taxonomy}/selected`]
  }

  created () {
    this.faker = faker
    this.sub()
  }

  async add () {
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
.list
  .sort
    margin-bottom 20px
  li
    display flex
    flex-flow row nowrap
    line-height 14px
    font-size 10px
    &.selected
      color red

  .item
    &__controls
      margin-left auto

      *
        line-height 14px

      button
        background transparent
</style>
