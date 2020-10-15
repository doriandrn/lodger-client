<template lang="pug">
.avatar(:class="{ disabled }")
  img(:src="value || placeholder" @click="!disabled ? $el.children[1].click() : undefined")
  file(v-if=  "!disabled" :id="id")
  span.holder(v-if= "!disabled")
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';
import file from 'c/formElements/file'

const avatars = new Avatars(sprites, {
  base64: true,
  style: 'circle'
});

export default {
  computed: {
    placeholder () {
      return avatars.create(this.seed)
    }
  },
  props: {
    id: {
      type: String,
      default: 'avatar'
    },
    value: {
      type: String,
      default: null
    },
    seed: {
      type: String,
      default: 'noname'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    file
  }
}
</script>

<style lang="stylus">
.avatar
  position relative

  &:not(.disabled)
    cursor pointer

  img
    max-width 160px
    height auto

  input[type="file"]
    position absolute

    &+.holder
      display none
</style>
