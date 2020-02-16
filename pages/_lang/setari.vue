<template lang="pug">
sction.setari(title="settings")

  tabs(v-if="asociatieActiva && asociatieActiva._id")
    tab(
      v-for=  "tab in tabs"
      :key=   "tab"
      :title= "$t(`defaults.${tab === 'utilizator' ? 'user.profile' : tab}`)"
    )

      frm(
        v-for=      "sectiune, i in formularSetari(tab)",
        :key=       "`${asociatieActiva._id}:${i}`"
        :title=     "sectiune.title"
        :desc=      "sectiune.desc"
        :formData=  "{ campuri: campuri(sectiune), for: i }"
      )
</template>

<script>
import sction from 'c/section'
import frm from 'c/form.vue'
import buton from 'form/button'

export default {
  data () {
    return {
      tabs: ['asociatie', 'utilizator', 'preferinte']
    }
  },
  computed: {
    campuri () {
      return section => section.fields
    }
  },
  components: {
    sction,
    frm,
    buton
  },
  methods: {
    formularSetari (tab) {
      // const form = require(`forms/${tab}.js`)
      // if (!form) return

      // const setari = { ...form.setari }
      // if (form.campuri && form.campuri.length > -1) {
      //   setari.default = {
      //     campuri: form.campuri.filter(camp => !camp.notInForm)
      //   }
      // }
      // this.debug('setari dupa merge cu campuri', setari)

      // // adauga labeluri n shit pt traduceri
      // Object.keys(setari).forEach(sectiune => {
      //   let tabSetari = `${tab}.setari.`
      //   setari[sectiune].title = `${tabSetari}${sectiune}.titlu`
      //   setari[sectiune].desc = `${tabSetari}${sectiune}.desc`
      //   const { campuri } = setari[sectiune]
      //   if (!campuri || !campuri.length) return
      //   campuri.forEach(camp => {
      //     camp.label = `${sectiune === 'default' ? `${tab}.new.` : tabSetari}${camp.click || camp.id}`
      //     camp['@click'] = camp.click ? `${tab}/${camp.click}` : null
      //     if (sectiune === 'periculoase') camp.dangerous = true
      //     if (sectiune === 'default') {
      //       camp['@change'] = `${tab}/updateaza`
      //     } else {
      //       camp.required = true
      //     }
      //   })
      // })

      // return setari
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

.setari
  .form
    border: 1px solid config.palette.borders
    padding 16px 24px
    align-items center
</style>
