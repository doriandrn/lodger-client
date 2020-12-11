/**
 * Main Vue helper component for rendering data from DB
 *
 * Renderless so it can be used inside Node/CLI or browsers & anything else.
 * This same component can and should be used for:
 * listing items, displaying statistics, displaying mixed items (eg. transactions)
 *
 */

<template lang="pug">
div
  slot(name="fuzzInput" :taxonomy="taxonomy" :subscriber="subscriber" :disabled="disabled")
  slot(:taxonomy="taxonomy" :subscriber="subscriber" :disabled="disabled")

  ul(
    v-if=   "documents.length || taxonomy && subscriber.ids.length"
    :class= "{ fetching: subscriber.fetching, ms: subscriber.options.multipleSelect }"
  )
    slot(
      name=   "item"
      v-for=  "item, id in withExtraData(documents.length ? documents : subscriber.items)"
      :item=  "item"
      :subscriber=  "taxonomy ? subscriber : null"
      :taxonomy=    "taxonomy"
    )

  //- empty state
  //- p(v-else-if="taxonomy && taxonomy.parents && taxonomy.parents.length") acest/aceasta {{ taxonomy.parents[0] }} nu detine nicio {{ taxonomy.form.name }} - adauga

  //- buton.more(
  //-   v-if="subscriber.ids && subscriber.ids.length < taxonomy.totals"
  //-   @click= "subscriber.criteria.limit = (subscriber.criteria.limit || 25) + subscriber.criteria.limit"
  //- ) ...
</template>

<script>
import empty from 'c/empty'
import buton from 'form/button'
import bani from 'c/bani'
import split from 'c/split'

import { SubscribableTaxonomy } from 'lodger'
import { reaction } from 'mobx'
import { Observer } from 'mobx-vue'

export default Observer({
  async fetch () {
    const { subscriberName, debug, criteria, taxonomy, itemsExtraData } = this
    if (subscriberName === 'unsubscribed')
      return

    let multipleSelect = false

    if (taxonomy.plural === 'apartamente' && subscriberName === 'single') {
      multipleSelect = true
    }

    await taxonomy.subscribe(subscriberName, { criteria: JSON.parse(JSON.stringify(criteria)), multipleSelect })

    if (!taxonomy.subscribers[subscriberName])
      throw new Error(`Subscriber "${ subscriberName }" does not exist`)

    this.subscriber = taxonomy.subscribers[subscriberName]
    this.subscriber.criteria = JSON.parse(JSON.stringify(criteria))
  },

  beforeMount () {
    this.debug('mount lol')
    this.subscriber.criteria.limit = (this.subscriber.criteria.limit || 1000) + 1
  },

  data () {
    return {
      subscriber: {
        name: 'unsubbscribed',
        ids: [],
        selectedId: '',
        activeId: '',
        items: {},
        criteria: this.criteria,
        options: {},
        fetching: true,
        kill: () => {}
      },
      documents: []
    }
  },
  name: 'R-Tax',
  props: {
    itemsExtraData: {
      type: Object,
      default: null
    },
    taxonomy: {
      type: SubscribableTaxonomy,
    },
    subscriberName: {
      type: String,
      default: 'main'
    },
    populated: {
      type: [Promise, Array],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    criteria: {
      type: Object,
      default () {
        return {
          sort: {
            createdAt: 'desc'
          }
        }
      }
    }
  },
  methods: {
    withExtraData (items) {
      const { itemsExtraData } = this
      if (!itemsExtraData || Object.values(itemsExtraData).filter(v => v !== 'undefined').length < 1)
        return items

      Object.keys(itemsExtraData).forEach(key => {
        Object.keys(itemsExtraData[key]).forEach(itemId => {
          if (!items[itemId])
            return
          items[itemId][key] = itemsExtraData[key][itemId]
        })
      })

      return items
    }
  },
  components: {
    empty,
    buton,
    bani,
    split
  },
  computed: {
    selectedId () {
      return this.subscriber.selectedId
    },
    activeId () {
      return this.subscriber.activeId
    },
    shouldShow () {
      const { taxonomy, documents, subscriberName } = this
      if (documents.length || !taxonomy) return true

      const { parents, form: { schema: { required } } } = taxonomy
      if (!parents) return true

      return required.filter(p => {
        const tax = p.indexOf('Id') === p.length - 2 ? p.replace('Id').plural : p
        const $tax = this.$lodger[tax]
        if (!$tax) return
        const subscriber = $tax.subscribers[subscriberName]
        if (!subscriber) return
        return Boolean(subscriber.ids.length)
      }).length > 0
      // taxonomy || taxonomy && taxonomy.parents && taxonomy.form.schema.required.filter(p => $lodger[taxAsPlural(p)] && $lodger[taxAsPlural(p)].subscribers[subscriberName] && $lodger[taxAsPlural(p)].subscribers[subscriberName].ids.length > 0).length > 0
    },
    // itemsCount () {
    //   if (this.documents) return this.documents.length
    //   return 0
    // },
  },
  watch: {
    selectedId: function  (ids, prevIds) {
      if (!ids || this.subscriberName !== 'single')
        return

      this.$emit('input', ids)
    }
  },

  beforeDestroy () {
    this.subscriber.kill()
  },
})
</script>
