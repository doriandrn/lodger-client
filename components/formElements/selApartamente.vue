<template lang="pug">
.selAp
  span(v-if="value.length") Apartamente selectate: {{ value.length }} / {{ optiuni.length }}
  span(v-else) Niciun apartament selectat
  p Denumire Criteriu: {{ numeCriteriu }}
  ul
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
        li(v-for=  "scara, i in scari(bId)")
          field(
            type=   "checkbox"
            :key=   "scara",
            :label= "`${$t('scara._articulat')} ${scara}`"
            :id=    "`${bId}:${scara}`"
            @input= "selecteazaToate(aparts(bId, i), $event)"
            :value= "toateApsSel(aparts(bId, i))"
            required= true
          )
          ul
            li(v-for=  "etaj in etaje(scara, bId)")
              field(
                type=   "checkbox"
                :key=   "etaj",
                :id=    "`${bId}:${scara}:${etaj}`"
                :label= "`${$t('bloc.etajul')} ${etaj}`"
                @input= "selecteazaToate(aparts(bId, i, etaj), $event)"
                :value= "toateApsSel(aparts(bId, i, etaj))"
                required= true
              )
              ul
                li.nume.check__apartament(v-for=  "ap in aparts(bId, i, etaj)")
                  field(
                    type=   "checkbox"
                    :key=   "ap._id"
                    :id=    "ap._id"
                    :value= "value.indexOf(ap._id) > -1"
                    @input=  "$event && value.indexOf(ap._id) < 0 ? value.push(ap._id) : value.splice(value.indexOf(ap._id), 1)"
                    :label= "`${ap.nr}. ${ap.proprietar}`"
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
      numeCriteriu: '...'
    }
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
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
    inputSelected (vechi, nou) {
      this.$emit('input', nou)
      return nou
    },
    selecteazaToate (apartamente, flag) {
      // this.debug(apartamente, flag)
      if (!apartamente && !apartamente.length) return
      let { value } = this
      apartamente.forEach(ap => {
        const { _id } = ap
        if (!_id) return
        const index = value.indexOf(_id)
        if (flag) {
          if (index < 0) value.push(_id)
        } else {
          if (index > -1) value.splice(index, 1)
        }
      })
      this.value = value
    },
    toateApsSel (aps) {
      let toate = true
      if (!aps && !aps.length) toate = false
      aps.forEach(ap => {
        if (this.value.indexOf(ap._id) < 0) toate = false
      })
      return toate
    },
    etaje (scaraId, blocId) {
      const e = []
      const { optiuni, blocuri, apartamente, debug } = this
      const { scari } = blocuri[blocId]
      if (!scari) return e

      optiuni.forEach(apId => {
        const { bloc, scara, etaj } = apartamente[apId]
        if (blocId !== bloc) return
        const _scara = scari[scara]
        if (!_scara) return
        const { id } = _scara
        if (!id) return
        if (id !== scaraId) return
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
      const s = {}
      const { blocuri, optiuni, apartamente, debug } = this

      optiuni.forEach(apId => {
        const { bloc, scara, etaj } = apartamente[apId]
        const _bloc = blocuri[bloc]
        if ( _bloc._id !== blocId ) return
        const { scari } = _bloc
        if (!scari.length) return

        scari.forEach(scr => {
          const { id } = scr

          if (id === undefined) return
          if (id !== scari[scara].id) return
          if (Object.values(s).indexOf(id) > -1) return

          s[scara] = id
        })
      })
      debug(s)
      return s
    }
  },
  watch: {
    value: 'inputSelected'
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
@require '~styles/config'

.selAp
  width 100%

  ul
    list-style-type none
    padding-left 16px

  > ul
    flex 1 1 100%
    padding-left 0
    display flex
    flex-flow column nowrap
    overflow auto
    max-height 360px

.check
  &__apartament
    input[type="checkbox"]:checked
      &+label:before
        background-color: config.palette.tertiary 
</style>
