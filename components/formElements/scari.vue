<template lang="pug">
field(
  v-if =      "Number(scariCount) < 2",
  type=       "number",
  :label=     "$t('bloc.etaje')",
  v-model=    "scari[0].etaje"
  :required=  "true"
)

ul.scari.zebra(v-else)
  .separator
  li(v-for="scara, i in scari")
    label.label Scara
      strong {{ scari[i].id }}
      p.test(@click="debug(scari)") {{ scari[i].lift }}
    field(
      :id=      "`scara-${i}`", 
      type=     "number"
      :label=   "$t('bloc.etaje')"
      v-model=  "scari[i].etaje",
      :required=  "true",
      @input=    "$emit('input', scari)"
    )
    field(
      :id=      "`id-${i}`",
      type=     "text"
      :label=   "$t('scara.new.name')",
      v-model=  "scari[i].id"
      :required=  "true",
      @input=    "$emit('input', scari)"
    )
    field(
      :id=        "`lift-${i}`",
      type=       "checkbox",
      :label=     "$t('scara.lift')",
      v-model=    "scari[i].lift",
      :required=  "true",
      @input=    "$emit('input', scari)"
    )
</template>

<script>
export default {
  data () {
    let scari = []
    const { value } = this
    if (!value) scari.push({
      id: '1',
      etaje: 4,
      lift: false
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
  props: {
    scariCount: {
      type: Number,
      default: 1
    },
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    scariCount: function (newVal, old) {
      if (newVal < 0 || old < 0) return
      let dif = 0

      if (newVal > old) {
        dif = newVal - old
        for (let i = old; i < newVal; i++) {
          if (i > 0) this.scari.push({ id: i+1, etaje: 1, lift: false })
        }
      } else {
        dif = old - newVal
        for (let i = newVal; i < old; i++) {
          if (i > 0) this.scari.splice(this.scari.length-1, 1)
        }
      }
    },
    scari: function () {
      this.$emit('input', this.scari)
    }
  }
}
</script>

<style lang="stylus" scoped>
.scari
  padding 0

  > li
    display flex
    margin -8px -8px 16px
    flex-flow row nowrap
    flex 1 1 100%
    align-items center
    
    > *
      margin 8px

    > label
      white-space nowrap
      margin-right 32px
      flex-basis 50%

      > strong
        margin-left 4px
</style>
