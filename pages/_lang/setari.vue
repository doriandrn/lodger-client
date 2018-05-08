<template lang="pug">
sction.setari(:title="$t('defaults.settings')")
  tabs
    tab(
      v-for=  "tab in tabs"
      :key=   "tab"
      :title= "$t(`defaults.${tab}`)"
    )

      frm(
        v-for=      "sectiune, i in forms(tab)",
        :key=       "i"
        :formData=  "{ campuri: sectiune.campuri, for: i }"
      )
</template>

<script>
import sction from '~components/section'
import frm from '~components/form.vue'
import buton from 'form/button'

import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      tabs: ['asociatie', 'utilizator']
    }
  },
  computed: {
    ...mapGetters({
    
    })
  },
  components: {
    sction,
    frm,
    buton
  },
  methods: {
    forms (tab) {
      return require(`forms/${tab}.js`).setari
    },
    ...mapActions({
      openModal: 'modal/open'
    })
  }
}
</script>
