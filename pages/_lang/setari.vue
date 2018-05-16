<template lang="pug">
sction.setari(:title="$t('defaults.settings')")
  tabs
    tab(
      v-for=  "tab in tabs"
      :key=   "tab"
      :title= "$t(`defaults.${tab === 'utilizator' ? 'user.profile' : tab}`)"
    )

      frm(
        v-for=      "sectiune, i in forms(tab)",
        :key=       "i"
        :title=     "sectiune.title"
        :desc=      "sectiune.desc"
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
      const setari = require(`forms/${tab}.js`).setari
      if (!setari) return

      // adauga labeluri n shit pt traduceri
      Object.keys(setari).forEach(sectiune => {
        const tabSetari = `${tab}.setari.`
        setari[sectiune].title = `${tabSetari}${sectiune}.titlu`
        setari[sectiune].desc = `${tabSetari}${sectiune}.desc`
        const { campuri } = setari[sectiune]
        if (!campuri || !campuri.length) return
        campuri.forEach(camp => {
          camp.label = `${tabSetari}${camp.click || camp.id}`
          camp.required = true
          if (sectiune === 'periculoase') camp.dangerous = true
        })
      })
      
      return setari
    },
    ...mapActions({
      openModal: 'modal/open'
    })
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.setari
  .form
    border: 1px solid config.palette.borders
    padding 16px 24px
</style>
