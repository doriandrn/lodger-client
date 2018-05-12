<template lang="pug">
ul.servicii
  li(
    v-for=      "serviciu in servicii"
    :data-icon= "serviciu.denumire"
    :data-sel=  "value && value.indexOf(serviciu.denumire) > -1"
    :class=     "{ ultimul: ultimulAdaugat === serviciu._id, modificabil: modificabil(serviciu.denumire) }"
    @click=     "toggleServiciu(serviciu.denumire)"
    @keydown.enter=     "toggleServiciu(serviciu.denumire)"
    @keydown.space=     "toggleServiciu(serviciu.denumire)"
    tabIndex=   0
  ) 
    span.nume {{ modificabil(serviciu.denumire) ? serviciu.denumire : $t(`serviciu.nume.${serviciu.denumire}`) }}
    .serviciu__actiuni(v-if="modificabil(serviciu.denumire)")
      buton(
        @click=   "$emit('modificaServiciu', serviciu)"
        :tooltip=  "true"
        styl=     "unstyled"
        icon=     "edit"
        icon-only
      ) {{ $t('serviciu.modifica') }}
      buton(
        dangerous,
        :prompt=  "{ type: 'warning', message: $t('serviciu.deletePrompt') }"
        @click=   "$emit('stergeServiciu', serviciu.denumire)"
        :tooltip=  "true"
        styl=     "unstyled"
        icon=     "trash"
        icon-only
      ) {{ $t('serviciu.sterge') }}
  li.nou(v-if="areAdauga")
    buton(
      icon=   "plus-circle",
      @click= "$emit('serviciuNou')",
      styl=   "unstyled"
      icon-only
    ) {{ $t('serviciu.adauga') }}
</template>

<script>
import { mapGetters } from 'vuex'
import buton from 'form/button'

export default {
  components: { buton },
  computed: {
    ...mapGetters({
      serviciiPredefinite: 'serviciu/predefinite',
      ultimulAdaugat: 'serviciu/ultim'
    })
  },
  methods: {
    toggleServiciu (e) {
      const value = this.value || []
      const i = value.indexOf(e)
      if (i > -1) {
        value.splice(i, 1)
      } else {
        value.push(e)
      }
      this.$emit('input', value)
    },
    modificabil (denumire) {
      return this.areAdauga && this.serviciiPredefinite.indexOf(denumire) < 0
    },
  },
  props: {
    servicii: {
      type: [Object, Array],
      default () {
        return {}
      }
    },
    areAdauga: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
serCulori = electricitate #ff9600 'evacuare-gunoi-menajer' #009688 apa #00c7ff gaze #5300ff termoficare #ff5722 internet #9c27b0

.servicii
  list-style-type none
  padding 0
  width 100%
  display flex
  flex-flow row wrap
  justify-content center

  > li
    display flex
    flex-flow column nowrap
    padding 10px
    border: 1px solid config.palette.bgs.body
    justify-content center
    text-align center
    align-items center
    flex 0 0 120px
    height 120px
    border-radius 60px
    margin 8px
    position relative
    transition all .15s ease-in-out
    cursor pointer
    font-size 12px
    line-height 16px
    background: config.palette.bgs.body
    box-shadow inset 0px 2px 3px 1px rgba(black, .025)
    user-select none

    for culoare, i in serCulori
      if i % 2 == 0
        &[data-icon=\"{serCulori[i]}\"]
          &[data-sel]
            &:before
              background-color: rgba(serCulori[i+1], .75)

    &[data-sel]
      // border-color: config.palette.tertiary
      border-color: config.palette.borders
      // box-shadow 0px 2px 3px 1px rgba(black, .05)
      background white

      &:before
        background-color: config.typography.palette.meta

    &[data-icon="electricitate"]
      &:before
        mask-size 22px

    &:hover
      box-shadow none

    &:focus
    &:active
      box-shadow: 0px 2px 3px 1px rgba(config.palette.secondary, .15)
      // background-color: rgba(config.palette.primary, .05)
      border-color: config.palette.secondary
      border-style dotted
      outline: none

      .nume
        color: config.typography.palette.headings

    &:before
      background-color: config.palette.borders
      mask-size 32px
      flex-basis 32px
      flex-shrink 0
      size 32px
      margin 0 0 8px
      transition all .1s ease

    .nume
      transition all .1s ease
      
    &.nou
      > button
        size 100%
        position absolute 0  

    &.modificabil
      &:hover
        .nume
          margin-bottom 12px
          margin-top -8px
          line-height 14px

        &:before
          transform scale(.75, .75)

        .serviciu__actiuni
          opacity 1
          visibility visible
  

.serviciu
  &__actiuni
    position absolute
    opacity 0
    visibility hidden
    z-index 3
    bottom 8px
    left 50%
    transform translateX(-50%)
    display flex
    flex-flow row nowrap
    align-items center
    justify-content center
    transition opacity .1s ease

    > button
      margin 4px
</style>
