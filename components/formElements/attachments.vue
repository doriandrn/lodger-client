<template lang="pug">
div(:class="status")
  h4(v-if="!value || value.length < 1") {{ $lodger.i18n.dropFiles }}
  ul(v-else)
    li(v-for="file in value") {{ file.name }}
</template>

<script>
import dragdrop from 'drag-drop'

export default {
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
          reader.addEventListener('load', e => {
            const buffer = new Buffer(new Uint8Array(e.target.result))
            this.$emit('input', {
              buffer,
              name,
              type,
              // size
            })
          })
          reader.readAsArrayBuffer(file)
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
.attachments
  min-height 80px
  display flex
  justify-content center
  align-items center
  text-align center
  border 2px dashed transparent

  &.enter
    border-color yellow
  &.over
    border-color green

  &.leave
    border-color blue
    background-color white

</style>
