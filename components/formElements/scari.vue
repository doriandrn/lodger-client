<template lang="pug">
.scariForm
  inpt(
    v-if =  "Number(scariCount) < 2",
    type=   "number",
    :label=  "$t('blocs.etaje')",
    v-model=  "scari[0].etaje"
  )

  ul.field.scari(v-else)
    .separator
    li(v-for="scara, i in scari")
      label.label Scara
        strong {{ scari[i].id }}
      inpt(
        :id=      "`scara-${i}`", 
        type=     "number"
        :label=   "$t('blocs.etaje')"
        v-model=  "scari[i].etaje",
        @input=   "$emit('input', scari)"
      )
      inpt(
        :id=      "`id-${i}`",
        type=     "text"
        :label=   "$t('blocs.new.name')",
        v-model=  "scari[i].id"
        @input=   "$emit('input', scari)"
      )
</template>

<script>
import inpt from 'form/input'

export default {
  data () {
    if (this.value) return { scari: this.value }
    return {
      scari: [{
        id: '1',
        etaje: 4
      }]
    }
  },
  props: {
    scariCount: {
      type: Number,
      default: 1
    },
    value: {
      type: Array,
      default: null
    }
  },
  components: {
    inpt
  },
  watch: {
    scariCount: function (newVal, old) {
      if (newVal < 0 || old < 0) return
      let dif = 0
      console.log(this, old, newVal, this.scariCount)
      if (newVal > old) {
        dif = newVal - old
        for (let i = old; i < newVal; i++) {
          console.log('I', i)
          if (i > 0) this.scari.push({ id: i+1, etaje: 1})
        }
        console.log('mai mare')
      } else {
        dif = old - newVal
        console.log('mai mic')
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
    margin -8px -8px 8px
    flex-flow row nowrap
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
