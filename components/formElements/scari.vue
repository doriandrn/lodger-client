<template lang="pug">
//- field(
//-   v-if =      "scariCount && Number(scariCount) < 2",
//-   type=       "number",
//-   :label=     "$t('bloc.etaje')",
//-   v-model=    "scari[0].etaje"
//-   :required=  "true"
//- )

ul.scari.zebra
  li(
    v-for=          "scara, i in scari"
    :data-mansarda= "scara.mansarda"
  )
    label.label Scara
      field.scari__id(
        :id=        "`id-${i}`",
        type=       "text"
        :label=     "$t('scara.new.name')",
        v-model=    "scari[i].id"
        :required=  "true",
        @input=     "$emit('input', scari)"
        hide-label
      )

    field(
      :id=        "`scara-${i}`", 
      type=       "number"
      :label=     "$t('bloc.etaje')"
      data-for=   "etaje",
      v-model=    "scari[i].etaje",
      :required=  "true",
      @input=     "$emit('input', scari)"
      hide-label
    )
    
    field(
      :id=            "`lift-${i}`",
      type=           "checkbox",
      :label=         "$t('scara.lift')",
      v-model.bool=   "scara.lift",
      :checked=       "Boolean(scara.lift)"
      :required=      "true"
    )
    field(
      :id=            "`mansarda-${i}`",
      type=           "checkbox",
      :label=         "$t('scara.mansarda')",
      v-model.bool=   "scara.mansarda",
      :checked=       "Boolean(scara.mansarda)"
      :required=      "true"
    )
  li(@click="scariCount++") adauga scara
</template>

<script>
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

    const scariCount = value.length
    return { scari, scariCount }
  },
  beforeCreate () {
    this.$options.components.field = require('form/field').default
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
    // scari: function () {
    //   this.$emit('input', this.scari)
    // }
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
</style>
