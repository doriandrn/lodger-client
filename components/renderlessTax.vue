/**
 * Main Vue helper component for rendering data from DB
 *
 * Renderless so it can be used inside Node/CLI or browsers & anything else.
 * This same component can and should be used for:
 * listing items, displaying statistics, displaying mixed items (eg. transactions)
 *
 */

<template lang="pug">
div(v-if="subscriber")
  slot(name="fuzzInput" :taxonomy="taxonomy" :subscriber="subscriber" :disabled="disabled")
  slot(:taxonomy="taxonomy" :subscriber="subscriber" :disabled="disabled")

  transition-group(
    v-if=   "taxonomy && subscriber && subscriber.ids.length"
    :class= "{ fetching: subscriber.fetching, ms: subscriber.options.multipleSelect }"
    name=   "flip-list"
    tag=    "ol"
  )
    slot(
      name=   "item"
      v-for=  "item, id in withExtraData(subscriber.items)"
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
// import { reaction } from 'mobx'
import { Observer } from 'mobx-vue'

export default Observer({
  // async fetch () {
  //   const { subscriberName, debug, taxonomy, itemsExtraData, id, selectedId } = this
  //   if (subscriberName === 'unsubscribed')
  //     return

  //   let multipleSelect = false, justInited = false
  //   const criteria = JSON.parse(JSON.stringify(this.criteria))

  //   if (id) {
  //     if ((id.indexOf('Id') < 0 || id === 'distribuire') && subscriberName.indexOf('single') === 0) {
  //       multipleSelect = true
  //     }
  //   } else {
  //     debug('no id!!!', taxonomy.plural)
  //   }

  //   debug('fetching', subscriberName, taxonomy.plural, this.selectedId, criteria)

  //   if (!taxonomy.subscribers[subscriberName]) {
  //     await taxonomy.subscribe(subscriberName, {
  //       criteria,
  //       multipleSelect,
  //       selectedId
  //     })
  //     justInited = true
  //   }

  //   const sub = this.subscriber = taxonomy.subscribers[subscriberName]

  //   if (!justInited && sub) {
  //     if (criteria)
  //       sub.criteria = JSON.parse(JSON.stringify(criteria))

  //     if (selectedId)
  //       sub.selectedId = selectedId
    // }
  // },

  // created () {
  //   const { subscriber, subscriberName, criteria, selectedId, debug } = this
  //   if (!subscriber)
  //     return

  //   // if (criteria.filter) {
  //   //   subscriber.criteria.filter = criteria.filter
  //   // } else {
  //   //   this.debug('mount filters', subscriber.criteria.filter)
  //   // }
  //   // if (criteria.limit !== undefined)
  //   //   this.subscriber.criteria.limit = criteria.limit

  //   if (subscriberName.indexOf('single') > -1)
  //     this.$watch('subscriber.selectedId', (ids) => {
  //       this.$emit('input', ids)
  //     })
  // },

  // data () {
  //   return {
  //     subscriber: null
  //   }
  // },
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
    subscriber: {
      type: Object,
      default: null
    },
    // subscriberName: {
    //   type: String,
    //   default: 'main'
    // },
    // selectedId: {
    //   type: [String, Array],
    //   default: null
    // },
    disabled: {
      type: Boolean,
      default: false
    },
    // criteria: {
    //   type: Object,
    //   default () {
    //     return {
    //       sort: {
    //         createdAt: 'desc'
    //       }
    //     }
    //   }
    // }
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
    shouldShow () {
      return true
    },

    subscriberName () {
      return this.subscriber.name
    }

  },

  beforeDestroy () {
    if (!this.subscriber)
      return

    this.subscriber.kill()
  },

  destroyed () {
    if (this._unwatch && typeof this._unwatch === 'function')
      this._unwatch()
  },
})
</script>
