<template lang="pug">
.luna
  button.luna__anterioara.buton__sageata.stanga(
    v-if=  "!prevDezactivat",
    @click="lunaAnterioara",

  ) Luna anterioara
  button.luna__selectata {{ selectat.luna }} {{ selectat.an }}
  button.luna__urmatoare.buton__sageata.dreapta(
    v-if=   "!nextDezactivat",
    @click="lunaUrmatoare"
  ) Luna urmatoare
  
  .luna__alege
    .luna__ani
      .luna__an(
        v-for=  "ani, key in disponibil",
        :key=   "key",
        :id=    "key",
        @click= "schimbaAn(key)"
      ) {{ key }}
    .luna__luni
      .luna__cl(
        v-for=  "luna, index in luni",
        :key=   "index",
        :id=    "'luna' + index",
        :class= "{selectata: luni.indexOf(selectat.luna) === index}"
      )
        span(v-if="disponibil[selectat.an].indexOf(index) < 0") {{ numeScurt(luna) }}
        button(v-else, @click="schimbaLuna(index)") {{ numeScurt(luna) }}

</template>

<script>
export default {
  data () {
    return {
      selectat: {
        luna: 'Ianuarie',
        an: 2017
      },
      luni: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
      prevDezactivat: false,
      nextDezactivat: false
    }
  },
  props: {
    disponibil: {
      type: Object,
      default () {
        return {
          '2016': [8, 9, 10, 11],
          '2017': [0, 1, 2, 3, 4, 5]
        }
      }
    }
  },
  methods: {
    numeScurt (luna) {
      return luna.slice(0, 3)
    },
    schimbaAn (an) {
      this.selectat.an = an

      // ajusteaza luna
      const das = this.disponibil[an]
      if (das.indexOf(this.luni.indexOf(this.selectat.luna)) < 0) {
        this.selectat.luna = this.luni[das[das.length - 1]]
      }

      this.updateazaButoane()
    },
    // schimba Luna
    schimbaLuna (luna) {
      if (luna > -1) {
        console.log('clickat pe luna')
        this.selectat.luna = this.luni[luna]
        this.updateazaButoane()
      }

      return incDec => {
        const das = this.disponibil[this.selectat.an]
        const dls = das.indexOf(this.luni.indexOf(this.selectat.luna))
        const lunaNoua = incDec ? das[dls + 1] : das[dls - 1]
        if (lunaNoua > -1) {
          this.schimbaLuna(lunaNoua)
        } else {
          const anNou = incDec ? this.selectat.an + 1 : this.selectat.an - 1
          const anCheck = this.disponibil[anNou]
          if (anCheck && anCheck.length > -1) {
            this.schimbaAn(anNou)
          } else {
            if (!incDec) {
              this.prevDezactivat = true
            } else {
              this.nextDezactivat = true
            }
          }
        }
      }
    },
    updateazaButoane () {
      const das = this.disponibil[this.selectat.an]
      const dls = das.indexOf(this.luni.indexOf(this.selectat.luna))

      this.prevDezactivat = das.indexOf(dls) === 0 && this.disponibil[this.selectat.an - 1]
      this.nextDezactivat = das.indexOf(dls) === das.length - 1
    },
    lunaAnterioara () {
      if (this.prevDezactivat) {
        return
      }
      this.schimbaLuna()(false)
    },
    lunaUrmatoare () {
      if (this.nextDezactivat) {
        return
      }
      this.schimbaLuna()(true)
    }
  }
}
</script>

<style lang="styl">
@import '~assets/styles/constante.styl'

.luna
  display inline-block
  vertical-align top
  position relative

  &__luni
    border-left 1px solid
    padding 0 12px

  &__cl
    lost-column 1/3 3 0
    text-transform uppercase
    padding 6px
    font-size 10px

    span
      color: culoare.griDeschis

    &.selectata
      button
        color red

  &__anterioara
    left 0

  &__urmatoare
    right 36px

  &__selectata
    line-height 36px
    background white
    padding 0 40px 0 20px
    border-radius 2px
    width 200px

  &__alege
    padding 10px
    background white
    position absolute 100% 0 auto auto
    width 240px
    border 1px solid
    z-index 11

    > div
      display inline-block
      vertical-align top

  &__ani
    width 60px

.buton
  &__sageata
    size 36px
    position absolute
    font-size 0
    icon dropdown 20px

    &:before
      position absolute 50% auto auto 50%
      transform translate(-50%, -50%)

    &.stanga
      &:before
        transform translate(-50%, -50%) rotate(90deg)

    &.dreapta
      &:before
        transform translate(-50%, -50%) rotate(-90deg)
</style>
