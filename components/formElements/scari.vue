<template lang="pug">
ul.scari.zebra
  li(
    v-for=          "scara, i in scari"
    :data-mansarda= "scara.mansarda"
  )
    label.label Scara
      field.scari__id(
        :id=          "`id-${i}`",
        type=         "text"
        label=        "scara.new.name",
        v-model=      "scara.id"
        :required=    "true",
        @input=       "$emit('input', scari)"
        :hide-label=  "i > 0"
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
    )
    
    field(
      :id=            "`lift-${i}`",
      type=           "checkbox",
      label=          "scara.lift",
      v-model.bool=   "scara.lift",
      :checked=       "scara.lift"
      @input=         "$emit('input', scari)"
    )

    field(
      :id=            "`mansarda-${i}`",
      type=           "checkbox",
      label=          "scara.mansarda",
      v-model.bool=   "scara.mansarda",
      :checked=       "scara.mansarda"
      @input=         "$emit('input', scari)"
    )
    buton(
      @click=       "stergeScara(i)"
      :disabled=    "scaraAreApartamente(i)"
      icon=         "trash"
      styl=         "unstyled"
      icon-only
      tooltip
    ) {{ $t('bloc.scara.sterge') }}
  buton(
    size=     "small"
    @click=   "scari.push({ id: scari.length + 1, etaje: 1, lift: false, mansarda: false })"
  ) adauga scara
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
    // TODO: implementeaza
    scaraAreApartamente (id) {
      this.debug(`scara ${id} are apartamente NEIMPL`, true)
      return true
    },
    etaje (i, cuMansarda) {
      const { value } = this

      if (cuMansarda) return Number(value[i].etaje) - 1
      return Number(value[i].etaje)
    },
    schimbaEtaje (scara, val, cuMansarda) {
      const { debug } = this
      debug('schimbaEtaje', val)
      scara.etaje = cuMansarda ? Number(val) + 1 : Number(val)
      this.$emit('input', this.scari)
    }
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
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
    max-width 53px

  > li
    display flex
    margin 0 -20px
    padding 0 12px
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
          left 16px
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
