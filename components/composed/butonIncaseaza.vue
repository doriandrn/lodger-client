<template lang="pug">
buton(
  icon=   "trending-up",
  :styl=  "styl"
  @click= "openModal( {id: 'incasare.new', data: { deLa: id } })"
) {{ $t('dashboard.actions.cashIn') }}
</template>

<script>
import buton from 'form/button'
import { mapActions } from 'vuex'

export default {
  methods: mapActions({
    openModal: 'modal/open'
  }),
  components: {
    buton
  },
  props: {
    id: {
      type: String,
      default: null
    },
    styl: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

</style>
