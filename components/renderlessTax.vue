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
  //- p ss: {{ shouldShow }} {{ subscriber.name }}
  slot(:taxonomy="taxonomy" :subscriber="subscriber")

  ul(
    v-if=   "documents.length || taxonomy && subscriber.ids.length"
    :class= "{ fetching: subscriber.feetching }"
  )
    slot(
      name=   "item"
      v-for=  "item, id in documents.length ? documents : subscriber.items"
      :item=  "item"
      :subscriber=  "taxonomy ? subscriber : null"
      :taxonomy=    "taxonomy"
    )

  //- empty state
  //- p(v-else-if="taxonomy && taxonomy.parents && taxonomy.parents.length") acest/aceasta {{ taxonomy.parents[0] }} nu detine nicio {{ taxonomy.form.name }} - adauga

  //- buton.more(
  //-   v-if="ids && ids.length < itemsCount"
  //-   @click="criteriu.limit = criteriu.limit + criteriu.limit"
  //- ) ...
</template>

<script>
/** Components Imports */
// import field from 'form/field'
import empty from 'c/empty'
import buton from 'form/button'
import bani from 'c/bani'
import viw from 'c/viewElement'
import split from 'c/split'

import { SubscribableTaxonomy } from 'lodger'
import { reaction } from 'mobx'
import { Observer } from 'mobx-vue'

export default Observer({
  data () {
    return {
      subscriber: {
        name: 'unsubbscribed',
        ids: [],
        selectedId: '',
        activeId: '',
        items: {},
        fetching: true,
        kill: () => {}
      },
      documents: []
    }
  },
  async fetch () {
    const { taxonomy, subscriberName, populated, subscriber } = this
    if (populated) {
      this.documents = populated
      return
    }
    if (subscriber.name === 'unsubscribed') return
    await taxonomy.subscribe(subscriberName)
    this.subscriber = taxonomy.subscribers[subscriberName]
  },
  name: 'Tax',
  props: {
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
    }
  },
  components: {
    empty,
    // field,
    buton,
    bani,
    viw,
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
    itemsCount () {
      if (this.documents) return this.documents.length
      return 0
    },
    // subscriber () {
    //   if (!this.taxonomy) return
    //   return this.taxonomy.subscribers[this.subscriberName]
    // }
  },
  // watch: {
  //   selectedId: function (ids, prevIds) {
  //     if (!ids) return

  //     const {
  //       subscriberName,
  //       subscriber,
  //       taxonomy
  //     } = this

  //     if (!taxonomy) return

  //     const {
  //       name,
  //       parents,
  //       children,
  //       subscribers,
  //       form: { plural }
  //     } = taxonomy

  //     if (!children.length) return

  //     children.map(tax => {
  //       const $tax = this.$lodger[tax]
  //       const { parents } = $tax
  //       const sub  = $tax.subscribers[subscriberName]
  //       if (!sub) return
  //       let sOrP, op, val
  //       if (parents && parents.length) {
  //         const isSingular = parents.indexOf(name) > -1
  //         sOrP = isSingular ? `${name}Id` : plural
  //         op = isSingular ? '$eq' : '$in'
  //         val = isSingular ? ids : [ids]
  //       }

  //       if (sOrP && op && val)
  //         sub.criteria.filter = { [sOrP]: { [op]: val } }
  //       else if (sub.criteria.filter[sOrP]) {
  //         delete sub.criteria.filter[sOrP]
  //       }
  //     })

  //   },
  //   activeId: async function (id, prevId) {
  //     if (id === prevId) return
  //     const activeDoc = await this.taxonomy.collection.findOne(id).exec()
  //     this.$lodger.modal.activeDoc = activeDoc
  //   }
  // },
  beforeDestroy () {
    this.subscriber.kill()
  },
  methods: {
    // get _sort () {
    //   if (!this.criteriu || !this.criteriu.sort) return
    //   return Object.keys(this.criteriu.sort)[0]
    // },

    // set _sort (e) {
    //   this.$emit('subscribe', { sort: { key: e } })
    // }
  }

  // xfind = this.referencesIds
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



  // get referencesIds () {
  //   const reffies = this.$lodger.activeReferencesIds(this.references)
  //   if (!reffies) return
  //   if (!this.criteriu) return reffies
  //   const { criteriu } = this

  //   const { find } = criteriu
  //   this.debug('F', find)
  //   if (find) {
  //     let same = true
  //     Object.keys(reffies).forEach(ref => {
  //       if (!reffies[ref]) return
  //       this.debug('ref', ref)
  //       if (reffies[ref] !== find[ref]) same = false
  //     })
  //     this.debug('same', same)
  //     if (!same) this.debug('!same!!!')
  //   } else {
  //     this.$emit('subscribe', reffies)
  //   }
  //   this.debug('refIds getter !', reffies)

  //   return reffies
  // }

  /**
   * This knows when to show the add button,
   *
   * checks if references provided exist so the add goes ok
   */


  // changeSortDirectionIfChecked (e) {
  //   const { index, checked } = e
  //   if (!checked) return
  //   if (!this.criteriu) return

  //   this.$emit('subscribe', sort: e )
  // }
})
</script>
