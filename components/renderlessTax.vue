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

  transition-group(name="flip-list" tag="ol"
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
    const { subscriberName, debug, criteria, taxonomy, itemsExtraData, id, selectedId } = this
    if (subscriberName === 'unsubscribed')
      return


    let multipleSelect = false

    if (id) {
      debug('!!!id', id)
      if ((id.indexOf('Id') < 0 || id === 'distribuire') && subscriberName.indexOf('single') === 0) {
        multipleSelect = true
      }
    } else {
      debug('no id!!!', taxonomy.plural)
    }

    debug('fetching', subscriberName, taxonomy.plural, this.selectedId, criteria)
    // debug(`FETCHING FOR SUB "${subscriberName}", TAX: ${taxonomy.plural}, selId: ${this.selectedId}, criteria: ${criteria}, MS: ${multipleSelect}, id: ${id}`)

    if (!taxonomy.subscribers[subscriberName])
      await taxonomy.subscribe(subscriberName, { criteria: JSON.parse(JSON.stringify(criteria)), multipleSelect })

    // throw new Error(`Subscriber "${ subscriberName }" does not exist`)

    const sub = this.subscriber = taxonomy.subscribers[subscriberName]
    sub.criteria = JSON.parse(JSON.stringify(criteria))
    // if (typeof selectedId !== 'undefined' && selectedId !== null) {

    //   debug('selecting shit', taxonomy, selectedId)
    //   sub.selectedId = selectedId
    // } else {
    //   debug('wtf selecteedIdd', selectedId)
    // }
    // //   //  && selectedId !== sub.selectedId
    // //   subscriber.selectedId = selectedId
    // //   // sub.select(selectedId)
    // // }
  },

  created () {
    const { subscriber, criteria, selectedId, debug } = this
    // debug('CM', subscriber, selectedId, criteria)
    if (criteria.filter) {
      subscriber.criteria.filter = criteria.filter
    } else {
      this.debug('mount filters', subscriber.criteria.filter)
    }
    if (criteria.limit !== undefined)
      this.subscriber.criteria.limit = criteria.limit
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
    id: {
      type: String,
      default: null
    },
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
    selectedId: {
      type: [String, Array],
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
    // selectedId () {
    //   return this.subscriber.selectedId
    // },
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
    selectedId: function (ids) {
      if (this.subscriberName.indexOf('single') < 0)
        return

      if (ids !== null)
        this.subscriber.selectedId = ids

      // console.info('II', this.subscriberName, ids, this.subscriber)

      // if (typeof ids === 'string' && ids.length && ids !== this.subscriber.selectedId)
      //   this.subscriber.select(ids)
      // if (this.subscriber.selectedId !== ids) {
      //   if (typeof ids === 'object') {
      //     if (ids !== null && ids.length) {
      //       ids.map(id => {
      //         this.subscriber.select(id)
      //       })
      //     }
      //   } else
      //     this.subscriber.select(ids)
      // }
      // this.$emit('input', ids)
    },
    // TODO (!ids.length && required ) - required prop for field in singles
    'subscriber.selectedId': function  (ids, prevIds) {
      if (this.subscriberName.indexOf('single') < 0)
        return

      // if (this.subscriber.selectedId !== ids) {
      //   this.subscriber.select(ids)
      // }
      if (typeof ids === 'string' || (typeof ids === 'object' && typeof ids.length !== 'undefined' ))
      this.$emit('input', ids)
    }
  },

  beforeDestroy () {
    this.subscriber.kill()
  },
})
</script>
