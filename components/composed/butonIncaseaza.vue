<template lang="pug">
buton(
  icon=   "trending-up"
  @click= "openModal('incasare.new')"
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
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

</style>
