<template lang="pug">
div(:class="status")
  h4(v-if="!value || value.length < 1") {{ $lodger.i18n.dropFiles }}
  ul(v-else)
    file(
      v-for=  "file, i in value"
      :key=   "`att-${i}`"
      :value= "file"
    )
</template>

<script>
import dragdrop from 'drag-drop'
import file from 'c/file'

export default {
  components: {
    file
  },
  data () {
    return {
      status: null
    }
  },
  mounted () {
    dragdrop(this.$el.parentElement, {
      onDragEnter: () => {
        this.status = 'enter'
      },
      onDragOver: () => {
        this.status = 'over'
      },
      onDragLeave: () => {
        this.status = 'leave'
      },
      onDrop: (files, pos, fileList, dirs) => {
        files.forEach(file => {
          const { name, type, size } = file
          const reader = new FileReader()
          reader.addEventListener('load', (e) => {
            const buffer = new Buffer(new Uint8Array(e.target.result))
            // this.setState({ file: reader.result })
            this.$emit('input', {
              buffer,
              name,
              type,
              // size
            })
          })
          // reader.readAsArrayBuffer(file)
          reader.readAsDataURL(file)
        })
      }
    })
  },
  props: {
    value: {
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@require '~styles/config'
palette = config.palette
typeColors = config.typography.palette

fileName()
  white-space nowrap
  font-size 12px
  color: typeColors.headings

ribbon()
  padding 0 4px
  background white
  border-radius 5px
  color: typeColors.headings
  border: 1px solid palette.borders

.attachments
  min-height 80px
  display flex
  justify-content center
  align-items center
  text-align center
  border 2px dashed transparent

  .name
    fileName()
    margin-top 8px

  .meta
    font-size 10px
    color: typeColors.meta

  ul
    display flex
    flex-flow row wrap
    overflow visible
    width 100%
    padding 12px

    li
      flex 0 0 100px
      display flex
      flex-flow column nowrap
      margin 0 4px
      padding 8px !important
      position relative
      align-items center
      justify-content center
      overflow visible
      background transparent

      &:after
        content: attr(data-fp)
        fileName()
        ribbon()
        position absolute
        bottom -30px
        z-index 33
        opacity 0
        transition all .25s ease

      &:hover
        &:after
          opacity 1


  &.enter
    border-color yellow
  &.over
    border-color green

</style>
