<template lang="pug">
ul.scari.zebra
  li(
    v-for=          "scara, i in scari"
    :data-mansarda= "scara.mansarda"
  )
    field.scari__id(
      :id=          "`id-${i}`",
      type=         "text"
      :label=          "$lodger.i18n.taxonomies.scari.fields.name",
      v-model=      "scara.id"
      :required=    "true",
      @input=       "$emit('input', scari)"
      :hide-label=  "i > 0"
      :disabled=  "disabled"
    )

    field(
      :id=          "`scara-${i}`",
      type=         "number"
      label=        "bloc.etaje"
      data-for=     "etaje",
      :required=    "true",
      @input=       "schimbaEtaje(scara, $event, scara.mansarda)"
      :value=       "etaje(i, scara.mansarda)"
      :hide-label=  "i > 0"
      :min=         "ultimulEtajDinScaraCuApartamente(i, scara.mansarda)"
      :max=          "124"
      :disabled=  "disabled"
    )

    field(
      :id=            "`lift-${i}`",
      type=           "checkbox",
      :label=          "$lodger.i18n.taxonomies.scari.fields.lift",
      v-model.bool=   "scara.lift",
      :checked=       "scara.lift"
      @input=         "$emit('input', scari)"
      :disabled=  "disabled"
    )

    field(
      :id=            "`mansarda-${i}`",
      type=           "checkbox",
      :label=          "$lodger.i18n.taxonomies.scari.fields.mansarda",
      v-model.bool=   "scara.mansarda",
      :checked=       "scara.mansarda"
      @input=         "$emit('input', scari)"
      :disabled=  "disabled"
    )
    buton(
      @click=       "stergeScara(i)"
      :disabled=    "scaraAreApartamente(i)"
      icon=         "trash"
      styl=         "unstyled"
      icon-only
      tooltip
    ) scara.sterge
  buton(
    v-if=     "scari.length < 14"
    size=     "small"
    icon=     "plus"
    @click=   "scari.push({ id: scari.length + 1, etaje: 1, lift: false, mansarda: false })"
    icon-only
    tooltip
  ) scara.new.title
</template>

<script>
import buton from 'form/button'

export default {
  data () {
    let scari = []

    const { value } = this
    if (!value) scari.push({
      id: '1',
      etaje: 4,
      lift: false,
      mansarda: false
    })

    if (value && value.length) {
      value.forEach(scara => {
        let x = {}
        Object.keys(scara).forEach(cheie => {
          x[cheie] = scara[cheie]
        })
        scari.push(x)
      })
    }

    return { scari }
  },
  beforeCreate () {
    this.$options.components.field = require('form/field').default
  },
  components: {
    buton
  },
  methods: {
    // TODO: implementeaza
    stergeScara (id) {
      this.debug('stergescara', id)
    },
    scaraAreApartamente (id) {
      return this.ultimulEtajDinScaraCuApartamente(id) > -1
    },
    etaje (i, cuMansarda) {
      const { value } = this
      if (value === undefined || value === null) return

      if (cuMansarda) return Number(value[i].etaje) - 1
      return Number(value[i].etaje)
    },
    schimbaEtaje (scara, val, cuMansarda) {
      const { debug } = this
      debug('schimbaEtaje', val)
      scara.etaje = cuMansarda ? Number(val) + 1 : Number(val)
      this.$emit('input', this.scari)
    },
    ultimulEtajDinScaraCuApartamente (index, cuMansarda) {
      // const { scari, $store: { getters } } = this
      // const blocActiv = getters['bloc/selectat']
      // if (!blocActiv) return
      // const { apartamente } = blocActiv
      // if (!apartamente || !apartamente.length) return -1
      // const etaje = []
      // apartamente.forEach(apId => {
      //   const { etaj, scara } = this.$store.getters.apartamente[apId]
      //   if (scara !== index) return
      //   if (etaje.indexOf(etaj) > -1) return
      //   etaje.push(etaj)
      // })

      // const max = etaje.sort((a, b) => Number(b) > Number(a))[0]

      // return cuMansarda ? max - 1 : max
    }
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // scariCount: function (newVal, old) {
    //   if (newVal < 0 || old < 0) return
    //   let dif = 0

    //   if (newVal > old) {
    //     dif = newVal - old
    //     for (let i = old; i < newVal; i++) {
    //       if (i > 0) this.scari.push({ id: i+1, etaje: 1, lift: false, mansarda: false })
    //     }
    //   } else {
    //     dif = old - newVal
    //     for (let i = newVal; i < old; i++) {
    //       if (i > 0) this.scari.splice(this.scari.length-1, 1)
    //     }
    //   }
    // },
    scari: function () {
      this.$emit('input', this.scari)
    }
  }
}
</script>

<style lang="stylus" scoped>
.scari
  padding 0
  width 100%
  display flex
  flex-flow column nowrap

  &__id
    max-width 108px

  > li
    display flex
    margin 0 -20px
    padding 4px 12px
    flex-flow row nowrap
    flex 0 0 100%
    align-items center

    .field[data-for="etaje"]
      max-width 60px
      flex 0 0 60px

    &[data-mansarda]
      .field[data-for="etaje"]
        &:before
          content '+ M'
          position absolute
          right 0
          bottom 9px
          z-index 0
          pointer-events none
          font-weight 100

    > *
      margin 8px

    > label
      white-space nowrap
      margin-right 32px
      flex 0 0 100px
      align-items center

      > strong
        margin-left 4px

    &+button
      margin-top 12px
</style>
