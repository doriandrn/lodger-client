<template lang="pug">
ul.servicii(:class="{ disabled }")
  li(
    v-for=              "serviciu, id in servicii"
    :data-icon=         "serviciu.denumire"
    :data-sel=          "value instanceof Array && value.indexOf(serviciu.denumire) > -1"
    @click=             "toggleServiciu(serviciu.denumire)"
    @keydown.enter=     "toggleServiciu(serviciu.denumire)"
    @keydown.space=     "toggleServiciu(serviciu.denumire)"
    tabIndex=           0
    v-tooltip=          "$l.i18n.taxonomies.servicii.predefinite[serviciu.denumire]"
  )
    //- span.nume {{ modificabil(serviciu.denumire) ? serviciu.denumire : $t(`serviciu.nume.${serviciu.denumire}`) }}
    //- .serviciu__actiuni(v-if="modificabil(serviciu.denumire)")
    //-   buton(
    //-     @click=     "$emit('modificaServiciu', serviciu)"
    //-     :tooltip=   "true"
    //-     styl=       "unstyled"
    //-     icon=       "edit"
    //-     icon-only
    //-   ) serviciu.modifica
    //-   buton(
    //-     dangerous,
    //-     :prompt=    "{ type: 'warning', message: $t('serviciu.deletePrompt') }"
    //-     @click=     "$emit('stergeServiciu', serviciu.denumire)"
    //-     :tooltip=   "true"
    //-     styl=       "unstyled"
    //-     icon=       "trash"
    //-     icon-only
    //-   ) serviciu.sterge
  //- li.nou(v-if="areAdauga")
  //-   buton(
  //-     icon=   "plus-circle",
  //-     @click= "$emit('serviciuNou')",
  //-     styl=   "unstyled"
  //-     icon-only
  //-   ) serviciu.adauga
</template>

<script>
import buton from 'form/button'

export default {
  components: { buton },
  methods: {
    toggleServiciu (e) {
      if (this.disabled)
        return

      const value = this.value || []
      const i = value.indexOf(e)

      if (i > -1) {
        value.splice(i, 1)
      } else {
        value.push(e)
      }
      this.$emit('input', value)
    },
    // modificabil (denumire) {
    //   return this.areAdauga && this.serviciiPredefinite.indexOf(denumire) < 0
    // },
  },
  props: {
    servicii: {
      type: [Object, Array],
      default () {
        return {}
      }
    },
    disabled: {
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
butSize = 40px

[data-tax] .servicii
  list-style-type none
  padding 0
  width 100%
  display flex
  flex-flow row wrap
  // justify-content center

  &:not(.disabled)
    > li
      cursor pointer
      background: config.palette.bgs.body
      box-shadow inset 0px 2px 3px 1px rgba(black, .025)

  &.disabled
    > li
      &:not([data-sel])
        display none

  > li
    display flex
    flex-flow column nowrap

    border: 1px solid config.palette.bgs.body
    justify-content center
    text-align center
    align-items center
    size: butSize

    border-radius 20px
    padding 0
    margin 2px
    position relative
    transition all .15s ease-in-out

    user-select none

    for culoare, i in serCulori
      if i % 2 == 0
        &[data-icon=\"{serCulori[i]}\"]
          &[data-sel]
            &:before
              background-color: rgba(serCulori[i+1], 1)

    &[data-sel]
      // border-color: config.palette.tertiary
      border-color: config.palette.borders
      // box-shadow 0px 2px 3px 1px rgba(black, .05)
      background white

      &:before
        background-color: config.typography.palette.meta

    &[data-icon="electricitate"]
      &:before
        mask-size 12px

    &:hover
      box-shadow none

    &:focus
    &:active
      box-shadow: 0px 2px 3px 1px rgba(config.palette.secondary, .15)
      // background-color: rgba(config.palette.primary, .05)
      outline: none

      .nume
        color: config.typography.palette.headings

    &:hover
    &:focus
    &:active
      &:before
        opacity 1

    &:before
      background-color: config.typography.palette.meta
      mask-size 20px
      flex-basis 20px
      flex-shrink 0
      size 20px
      margin 0
      opacity .5
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
