<template lang="pug">
sction.setari(:title="$t('defaults.settings')")
  tabs
    tab(:title="$t('defaults.asociatie')") asoc
      buton(
        @click= "openModal('feedback.new')"
      ) Feedback

    tab(:title="$t('defaults.user.profile')")
      frm
</template>

<script>
import sction from '~components/section'
import frm from '~components/form.vue'
import buton from 'form/button'

import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters({
    
  }),
  components: {
    sction,
    frm,
    buton
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open'
    })
  }
}
</script>
