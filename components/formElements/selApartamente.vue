<template lang="pug">
ul.selAp
  li(v-for=  "bId in _blocuri")
    field(
      type=   "checkbox"
      :label= "blocuri[bId].nume"
      :key=   "bId"
      :id=    "bId"
      @input= "selecteazaToate(aparts(bId), $event)"
      :value= "toateApsSel(aparts(bId))"
      required= true
    )
    ul
      li(v-for=  "scara in scari(bId)")
        field(
          type=   "checkbox"
          :key=   "scara",
          :label= "`${$t('scara._articulat')} ${scara}`"
          :id=    "`${bId}:${scara}`"
          @input= "selecteazaToate(aparts(bId, scara), $event)"
          :value= "toateApsSel(aparts(bId, scara))"
          required= true
        )
        ul
          li(v-for=  "etaj in etaje(scara, bId)")
            field(
              type=   "checkbox"
              :key=   "etaj",
              :id=    "`${bId}:${scara}:${etaj}`"
              :label= "`${$t('bloc.etajul')} ${etaj}`"
              @input= "selecteazaToate(aparts(bId, scara, etaj), $event)"
              :value= "toateApsSel(aparts(bId, scara, etaj))"
              required= true
            )
            ul
              li.nume(v-for=  "ap in aparts(bId, scara, etaj)")
                field(
                  type=   "checkbox"
                  :key=   "ap._id"
                  :id=    "ap._id"
                  :value= "selectate.indexOf(ap._id) > -1"
                  @input=  "$event && selectate.indexOf(ap._id) < 0 ? selectate.push(ap._id) : selectate.splice(selectate.indexOf(ap._id), 1)"
                  :label= "`${ap.nr} ${ap.proprietar}`"
                  required= true
                )
  //- li(v-for="apId, index in optiuni") {{ apartamente[apId].proprietar }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'selApartamente',
  data () {
    return {
      selectate: []
    }
  },
  props: {
    // selectate: {
    //   type: Array,
    //   default () {
    //     return []
    //   }
    // },
    /** 
     * Id-uri de apartamente
    */
    optiuni: {
      type: Array,
      default () {
        return []
      }
    }
  },
  beforeCreate () {
    this.$options.components.field = require('form/field').default
  },
  methods: {
    selecteazaToate (apartamente, flag) {
      this.debug(apartamente, flag)
      if (!apartamente && !apartamente.length) return
      let { selectate } = this
      apartamente.forEach(ap => {
        const { _id } = ap
        if (!_id) return
        const index = selectate.indexOf(_id)
        if (flag) {
          if (index < 0) selectate.push(_id)
        } else {
          if (index > -1) selectate.splice(index, 1)
        }
      })
      this.selectate = selectate
    },
    toateApsSel (aps) {
      let toate = true
      if (!aps && !aps.length) toate = false
      aps.forEach(ap => {
        if (this.selectate.indexOf(ap._id) < 0) toate = false
      })
      return toate
    },
    etaje (scaraId, blocId) {
      const e = []
      const { optiuni, apartamente, debug } = this

      optiuni.forEach(apId => {
        const { bloc, scara, etaj } = apartamente[apId]

        if (blocId !== bloc) return
        if (scara !== scaraId) return
        if (e.indexOf(etaj) > -1) return
        e.push(etaj)
      })
      return e
    },
    aparts (bloc, scara, etaj) {
      const { loc } = this
      return loc({
        etaj, scara, bloc
      })
    },
    scari (blocId) {
      const s = []
      const { blocuri, optiuni, apartamente, debug } = this

      optiuni.forEach(apId => {
        const { bloc, scara, etaj } = apartamente[apId]
        const _bloc = blocuri[bloc]
        if ( _bloc._id !== blocId ) return
        const { scari } = _bloc
        if (!scari.length) return
        debug(scara, s.indexOf(scara), scari)
        scari.forEach(scr => {
          const { id } = scr
          if (id !== scara) return
          if (s.indexOf(id) > -1) return
          debug('adgat', id)
          s.push(id)
        })
      })

      debug(s, 'scari')
      return s
    }
  },
  computed: {
    _blocuri () {
      const b = []
      const { apartamente, blocuri, optiuni } = this

      optiuni.forEach(apId => {
        const { bloc } = apartamente[apId]
        const { _id } = blocuri[bloc]
        if (b.indexOf(_id) < 0) b.push(_id)
      })
      return b
    },
    ...mapGetters(['apartamente', 'blocuri']),
    ...mapGetters({
      loc: 'apartament/localizeaza'
    })
  }
}
</script>

<style lang="stylus">
.selAp
  list-style-type none
  padding-left 0
  display flex
  flex-flow column nowrap
  overflow auto
  flex 1 1 100%
  width 100%
  max-height 100%

  ul
    list-style-type none
    padding-left 16px
</style>
