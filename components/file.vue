<template lang="pug">
li(:data-fp= "name")
  buton.f(
    @click=   "$emit('download')"
    :data-ext="extension"
  )
    i(:data-icon="icon")
  .name {{ shortenedName }}
  .meta
    span.size {{ humanSize(value.length, 2) }}

  .a
    buton(
      type= "link"
      icon= "download"
      styl= "unstyled"
    ) dl
    buton(
      icon= "trash"
      styl= "unstyled"
      @click= "value.remove()"
    ) {{ $lodger.i18n.trash }}
</template>

<script>
import buton from 'form/button'
import humanSize from 'human-size'

const brands = {
  icons: {
    svg: 'image',
    png: 'image',
    gif: 'image',
    tiff: 'image',
    psd: 'image',
  }
}

export default {
  props: {
    value: {
      type: Object,
      default: null,
      required: true
    }
  },
  methods: {
    humanSize
  },
  computed: {
    extension () {
      const { name } = this
      const spl = name.split('.')

      return spl[spl.length - 1]
    },
    name () {
      return this.value.id
    },
    woExt () {
      return this.name.replace(`.${this.extension}`, '')
    },
    shortenedName () {
      const s = this.woExt
      const { length } = s
      if (length < 14)
        return s
      return `${s.substr(0, 5)}.. ${s.substr(length - 6, length)}`
    },

    icon () {
      return brands.icons[this.extension]
    }
  },
  components: {
    buton
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
palette = config.palette
typeColors = config.typography.palette

iw = 78px
ih = iw * 1.32
$br = ih / 20

defaultColor = blue
imgColor = orange
videoColor = purple

colors = {
  svg: imgColor
  png: imgColor
  jpg: imgColor
  jpeg: imgColor
  tiff: imgColor
  gif: imgColor

  pdf: red
}


li[data-fp]
  .a
    position absolute 0
    background rgba(white, .95)
    z-index 34
    display flex
    flex-flow column nowrap
    justify-content center
    border-radius 5px
    opacity 0
    visibility: hidden

    > :first-child
      flex-basis 80%
      display flex
      flex-flow column nowrap


    > :nth-child(2)
      border-top: 1px solid palette.borders
      border-radius 0
      padding-top 4px

  &:hover
    .a
      visibility visible
      opacity 1

  .f
    width: iw
    height: ih
    margin 4px
    padding 0
    position relative
    border-style solid
    border-width: 0 0 iw 55px
    border-radius 6px
    border-color: defaultColor

    &:before
    &:after
      content: ''
      display: block
      position: absolute
      top: 0
      right: 0
      size 0
      border-style: solid
      border-width 12px 12px
      border-top-color: transparent !important
      border-right-color: transparent !important


    &:before
      z-index: 2;
      background-color transparent
      border-bottom-left-radius: $br
      border-color: lighten(defaultColor, 10%);
      box-shadow: -5px 5px 5px darken(defaultColor, 5%);

    &:after
      content: attr(data-ext);
      border-color: defaultColor;
      z-index: 1;
      border-top-color: transparent;
      border-right-color: transparent;
      font-family: Monaco, monospace;
      font-size: iw * 0.18;
      color: white;
      text-indent:  -(iw) * 0.7;
      line-height: ih * 1.4;

    for ext, color in colors
      &[data-ext={ext}]
        border-color: color

        &:before
          border-color: lighten(color, 10%);
          box-shadow: -5px 5px 5px darken(color, 5%);

        &:after
          border-color: color;
    i
      position absolute
      top 150%
      left -28px
      size 24px

      &:before
        size 24px
        mask-size 24px
        background-color: palette.icons
</style>
