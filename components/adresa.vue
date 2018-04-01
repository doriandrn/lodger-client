<template lang="pug">
nuxt-link.adresa(:to="`/apartament/${id}`")
  nuxt-link.adresa__main(
    v-if= "bloc",
    :to=  "`/bloc/${bloc._id}`"
  ) {{ bloc.nume }} / {{ scara }} ({{ etaj }})
  .adresa__owner
    span.ap__nr(v-if="nrAp") {{ nrAp }} 
    span.nume.proprietar {{ proprietar }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      blocuri: 'blocuri',
      apartamente: 'apartamente'
    }),
    ap () {
      return this.apartamente[this.apId]
    },
    id () {
      return this.ap._id
    },
    bloc () {
      const { bloc } = this.ap
      return this.blocuri[bloc]
    },
    scara () {
      return this.ap.scara
    },
    etaj () {
      return this.ap.etaj
    },
    nrAp () {
      return this.ap.nr
    },
    proprietar () {
      return this.ap.proprietar
    }
  },
  props: {
    apId: {
      type: String,
      required: true,
      default: null
    }
    // bloc: {
    //   type: Object,
    //   default () {
    //     return {
    //       '_id': -1,
    //       nume: 'Nedefinit'
    //     }
    //   }
    // },
    // scara: {
    //   type: String,
    //   default: null
    // },
    // etaj: {
    //   type: Number,
    //   default: 0
    // },
    // nrAp: {
    //   type: String,
    //   default: null
    // }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
  
.adresa
  display flex
  flex-flow column wrap
  text-decoration none
  line-height 20px

  &__main
    font-weight 100
    text-transform uppercase
    margin-right 8px
    letter-spacing 2px
    font-size 10px

  &__owner
    display flex
    flex-flow row nowrap
    align-items flex-start

    .ap__nr
      margin-top 1px
      flex 1 0 40px
      text-align right
      margin-right 12px
      display flex
      flex-flow row nowrap
      align-items flex-end
      justify-content flex-end

      &:after
        content '.'

    .proprietar
      flex 1 1 100%
      color: config.typography.palette.body
</style>
