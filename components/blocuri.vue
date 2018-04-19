<template lang="pug">
swiper.blocuri(
  ref=        "blocuriSwiper"
  :options=   "swiperOpts"
)
  swiper-slide.bloc(
    v-for=      "bloc, blocId in blocuri",
    :key=       "blocId",
    :class=     "{ ultimul: blocId === ultimulBlocAdaugat }"
    :data-nume= "bloc.nume"
  )
    bloc(
      :id=  "blocId"
      modificabil
    )

    //- .bloc__actiuni
    //-   buton(
    //-     styl=   "unstyled"
    //-     icon=   "edit"
    //-     icon-only
    //-     @click= "openModal({ id: 'bloc.edit', data: { _id: bloc._id }})"
    //-     tooltip
    //-   ) {{ $t('bloc.edit.title') }}
    //-   buton(
    //-     styl=     "unstyled"
    //-     @click=   "stergeBloc(bloc._id)"
    //-     icon=     "trash"
    //-     icon-only
    //-     tooltip
    //-     dangerous
    //-   ) {{ $t('bloc.delete') }}
    

  .blocuri__tabs(slot="pagination")
    .blocuri__list
    buton.bloc__add(
      icon=   "plus-circle",
      slot=   "right"
      @click= "openModal('bloc.new')"
      size=   "medium"

      icon-only
    ) {{ $t('bloc.new.title') }}

  buton.urm.blocuri__nav(
    slot=     "button-next"
    arrow=    "right"
    styl=     "unstyled",
    rounded
  ) {{ $t('bloc.urmator') }}
  buton.ant.blocuri__nav(
    slot=     "button-prev"
    arrow=    "left"
    styl=     "unstyled",
    rounded
  ) {{ $t('bloc.anterior') }}
</template>

<script>
import bloc from 'struct/bloc'
import buton from 'form/button'

import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      swiperOpts: {
        slideActiveClass: 'activ',
        pagination: {
          el: '.blocuri__list',
          clickable: true,
          renderBullet: (i, cls) => {
            const activ = this.blocuri[this.idsBlocuri[i]]
            if (!activ) return
            return `<span class="${cls}">
              <label class="nume">${activ.nume}</label>
              <span class="bloc__actions">
                <button onclick="$nuxt.$store.dispatch('modal/open', { id: 'bloc.edit', data: { _id: '${activ._id}' } })" aria-label="${ this.$t('bloc.edit.title') }" data-tip="true" data-icon="edit" data-size="medium" data-styl="unstyled" class="iconOnly">${ this.$t('bloc.edit') }</button>
              </span>
            </span>`
          },
          bulletActiveClass: 'activ'
        },
        centeredSlides: true,
        longSwipes: false,
        slidesPerView: 'auto',
        // spaceBetween: 64,
        loop: false,
        keyboard: true,
        navigation: {
          nextEl: '.blocuri__nav.urm',
          prevEl: '.blocuri__nav.ant',
          disabledClass: 'disabled'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      idsBlocuri: 'bloc/ids',
      ultimulBlocAdaugat: 'bloc/ultim'
    })
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open',
      stergeBloc: 'bloc/sterge'
    })
  },
  props: {
    blocuri: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    bloc,
    buton
  }
}
</script>

<style lang="stylus">
@require '~styles/config'

drkr = rgba(black, .05)

.blocuri
  fullflex()
  flex-grow 0
  flex-flow row nowrap
  overflow visible
  list-style-type none
  padding 0
  position relative
  margin-bottom 0
  margin-top auto
  // margin: -(config.spacings.inBoxes)

  +above(l)
    margin-bottom 32px

  &:before
    content ''
    position fixed 48px 0 42px
    background: linear-gradient(to right, drkr 0%, transparent 15%, transparent 85%, drkr 100%)
    z-index 5
    pointer-events none
    border-top-radius 50%

  > div
    z-index 4

  &__nav
    position fixed
    z-index 10
    top 0
    bottom 0
    // transform translateY(-50%)
    width 15%
    font-size 0
    transition all .15s ease-in-out, opacity 1.5s ease-out

    +desktop()
      visibility visible

    &:after
      background-color: config.typography.palette.ui !important
      margin 0
      mask-size 32px
      mask-position 50% 50%
      size 32px

    &:hover
      &:after
        background-color: config.palette.primary !important

    &.urm
      right 0

    &.ant
      left 0

    &.disabled
      opacity 0
      cursor default

  &__tabs
    position fixed
    // position absolute
    z-index 11 !important
    display flex
    width 100%
    bottom 0 !important
    flex-flow row nowrap
    justify-content center
    background: config.palette.bgs.body

    .bloc
      &__actions
        margin-left auto

  &__list
    display flex
    flex-flow row nowrap
    flex 1 1 100%

    > span
      flex 1 1 auto
      display flex
      flex-flow row nowrap
      size auto
      outline 0
      opacity 100
      border-radius 0
      background transparent
      // border-top: 1px solid config.palette.borders
      padding 8px 16px
      margin 0 !important
      transition all .1s ease-in-out
      text-transform capitalize

      .nume 
        color: config.typography.palette.meta
        margin-right 24px

      &.activ
        // border-color: config.palette.primary
        background white

        .nume
          color: config.typography.palette.headings

      &:not(.activ)
        .bloc__actions
          visibility hidden

        &:hover
          color: config.typography.palette.headings
          border-color: config.typography.palette.ui

      // for i in 1..10
      //   &:nth-child({i})
      //     background-color: lighten(config.palette.primary, 80% + i*1.5)
  ul
    list-style-type none
    padding 0

  > li
    margin: config.spacings.inBoxes
    flex 1 0 180px
    display flex
    flex-flow column nowrap
    text-align center
     

    > .split > .left > label
      text-transform uppercase

    > .bloc
      padding-top 16px
      margin-top 16px
      // border-top: 1px solid config.palette.borders

    &.ultimul
      > .split > .left label
        &:after
          content ''
          bubble()
</style>

